const app = require ('./app');
const port = process.env.port || 4000;

app.listen(port, () => { 
    console.log(`server started on ${port}`);
    
});
