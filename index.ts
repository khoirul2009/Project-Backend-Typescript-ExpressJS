import App from "./src/core/App";



const port: number = 8000;
const app = new App().app;


app.listen(port, () => {
    console.log(`This app run in port ${port}`);

});
