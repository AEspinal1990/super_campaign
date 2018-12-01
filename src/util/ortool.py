from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
import argparse
import json
import math
import sys

def readFile():
    # read json file from path
    with open("../data/ordata.json") as file:
        locations = json.load(file)
    
    return locations


def fillData():
    file = readFile()
    locations = file["locations"]
    # print(locations)
    data = {}
    data["locations"] = locations
    data["geocodes"] = [(l["_lat"], l["_long"]) for l in locations]
    data["num_locations"] = len(data["geocodes"])
    data["num_canvassers"] = file["num_canvassers"]
    data["depot"] = 0
    data["travel_speed"] = file["avg_travel_speed"]

    # create a list of demands as the AVG_TIME_PER_LOCATION
    data["demands"] = []
    for x in range(0, data["num_locations"]): #pylint: disable=unused-variable
        data["demands"].append(file["estimated_visit_time"])

    # create a list of capacities as WORKDAY_LIMIT
    data["capacities"] = []
    for y in range(file["num_canvassers"]): #pylint: disable=unused-variable
        data["capacities"].append(file["workday_limit"])
    # print(data)
    return data


def manhattan_distance(coord1, coord2):
    R = 6371e3
    t1 = coord1[0] * math.pi / 180
    t2 = coord2[0] * math.pi / 180
    t3 = abs(coord2[0] - coord1[0]) * math.pi / 180
    t4 = abs(coord2[1] - coord1[1]) * math.pi / 180

    a = math.sin(t3 / 2) * math.sin(t3 / 2) + \
        math.cos(t1) * math.cos(t2) * \
        math.sin(t3 / 2) * math.sin(t4 / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    d = R * c
    return d


def create_distance_callback(data):
    _distances = {}

    for from_node in range(data["num_locations"]):
        _distances[from_node] = {}
        for to_node in range(data["num_locations"]):
            if from_node == to_node:
                _distances[from_node][to_node] = 0
            else:
                _distances[from_node][to_node] = (
                    manhattan_distance(data["geocodes"][from_node],
                        data["geocodes"][to_node])
                )

    def distance_callback(from_node, to_node):
        return _distances[from_node][to_node]

    return distance_callback


# demand === time per location
# capacities === max time
def create_demand_callback(data):
    def demand_callback(from_node, to_node):

        service_time = data["demands"][from_node]

        # find the travel time
        if from_node == to_node:
            travel_time = 0
        else:
            travel_time =  manhattan_distance(data["geocodes"][from_node],
                        data["geocodes"][to_node]) / data["travel_speed"]
        
        # remove the travel times for the depot - the start and end
        if from_node == 0 or to_node == 0:
            travel_time = 0
            service_time = 0

        return service_time + travel_time
    
    return demand_callback


def add_capacity_constraints(routing, data, demand_callback):
    capacity = "Capacity"
    routing.AddDimensionWithVehicleCapacity(
        demand_callback,
        0,
        data["capacities"],
        True,
        capacity)

def main():
    # receive data from json file  
    data = fillData()
    # print(data)
    # Create routing model
    routing = pywrapcp.RoutingModel(data["num_locations"], data["num_canvassers"], data["depot"])
    distance_callback = create_distance_callback(data)
    routing.SetArcCostEvaluatorOfAllVehicles(distance_callback)

    '''Add specifications/limitations with dimensions'''
    # distance dimension
    # time dimension
    demand_callback = create_demand_callback(data)
    add_capacity_constraints(routing, data, demand_callback)

    # Search options - set to first solution heuristic
    search_parameters = pywrapcp.RoutingModel.DefaultSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC) # pylint: disable=no-member
    assignment = routing.SolveWithParameters(search_parameters)
    # print(assignment)

    tasks = {}
    tasks["routes"] = []
    for vehicle_id in range(data["num_canvassers"]):
        index = routing.Start(vehicle_id)

        # check if there is no locations for this task
        if routing.IndexToNode(assignment.Value(routing.NextVar(index))) == 0:
            continue
        else:
            route = {}
            route["locations"] = []
            # create the route for this task
            while not routing.IsEnd(index):
                index = assignment.Value(routing.NextVar(index))
                location_index = routing.IndexToNode(index)
                if location_index != 0:
                    route["locations"].append(data["locations"][location_index])
            # add route to tasks
            tasks["routes"].append(route)

    # open new json file - if problems occur in different enviornments use with io and encode as utf 8
    with open('../data/result_tasks.json', 'w') as outfile:
        # write lists of tasks into json file
        json.dump(tasks, outfile, indent=4, ensure_ascii=False)

    '''print solution - for testing'''
    total_distance = 0
    for vehicle_id in range(data["num_canvassers"]):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:\n'.format(vehicle_id)
        distance = 0
        while not routing.IsEnd(index):
            # print(routing.IndexToNode(index))
            # if routing.IndexToNode(index) != '0'):
            plan_output += ' {} ->'.format(routing.IndexToNode(index))
            previous_index = index
            index = assignment.Value(routing.NextVar(index))
            distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
        plan_output += ' {}\n'.format(routing.IndexToNode(index))
        plan_output += 'Distance of route: {}m\n'.format(distance)
        # print(plan_output)
        total_distance += distance
    # print('Total distance of all routes: {}m'.format(total_distance))

    sys.stdout.flush()
main()