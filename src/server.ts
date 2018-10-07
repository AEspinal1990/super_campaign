import app from './app';

const server = app.listen(app.get('port'), () => {
    console.log('APp is running on port', app.get('port'), app.get('env'))
})

export default server;

