# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: ortools/constraint_solver/search_limit.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='ortools/constraint_solver/search_limit.proto',
  package='operations_research',
  syntax='proto3',
  serialized_options=_b('\n#com.google.ortools.constraintsolverB\023SearchLimitProtobufP\001\252\002\037Google.OrTools.ConstraintSolver'),
  serialized_pb=_b('\n,ortools/constraint_solver/search_limit.proto\x12\x13operations_research\"\x8a\x01\n\x15SearchLimitParameters\x12\x0c\n\x04time\x18\x01 \x01(\x03\x12\x10\n\x08\x62ranches\x18\x02 \x01(\x03\x12\x10\n\x08\x66\x61ilures\x18\x03 \x01(\x03\x12\x11\n\tsolutions\x18\x04 \x01(\x03\x12\x18\n\x10smart_time_check\x18\x05 \x01(\x08\x12\x12\n\ncumulative\x18\x06 \x01(\x08\x42^\n#com.google.ortools.constraintsolverB\x13SearchLimitProtobufP\x01\xaa\x02\x1fGoogle.OrTools.ConstraintSolverb\x06proto3')
)




_SEARCHLIMITPARAMETERS = _descriptor.Descriptor(
  name='SearchLimitParameters',
  full_name='operations_research.SearchLimitParameters',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='time', full_name='operations_research.SearchLimitParameters.time', index=0,
      number=1, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='branches', full_name='operations_research.SearchLimitParameters.branches', index=1,
      number=2, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='failures', full_name='operations_research.SearchLimitParameters.failures', index=2,
      number=3, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='solutions', full_name='operations_research.SearchLimitParameters.solutions', index=3,
      number=4, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='smart_time_check', full_name='operations_research.SearchLimitParameters.smart_time_check', index=4,
      number=5, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='cumulative', full_name='operations_research.SearchLimitParameters.cumulative', index=5,
      number=6, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=70,
  serialized_end=208,
)

DESCRIPTOR.message_types_by_name['SearchLimitParameters'] = _SEARCHLIMITPARAMETERS
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

SearchLimitParameters = _reflection.GeneratedProtocolMessageType('SearchLimitParameters', (_message.Message,), dict(
  DESCRIPTOR = _SEARCHLIMITPARAMETERS,
  __module__ = 'ortools.constraint_solver.search_limit_pb2'
  # @@protoc_insertion_point(class_scope:operations_research.SearchLimitParameters)
  ))
_sym_db.RegisterMessage(SearchLimitParameters)


DESCRIPTOR._options = None
# @@protoc_insertion_point(module_scope)
