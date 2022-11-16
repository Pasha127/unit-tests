const errorHandler = (err, req, res, next) => {
    /* (err instanceof mongoose.Error.ValidationError) && (err.status = 400); 
    (err instanceof mongoose.Error.CastError) && (err.status = 400);  */
    
    /* if(err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.ValidationError){
        res.status(400).send({ message: err.message, errorsList: err.errorsList });
        console.log("400 in errorHandler", err.status);
        return;
    } */

    switch (err.status){
      case 400:
        res.status(400).send({ message: err.message, errorsList: err.errorsList });
        console.log("400 in errorHandler", err.status);
        break;
  
      case 401:
        res.status(401).send({ message: err.message });
        console.log("401 in errorHandler", err.status);
        break;
  
      case 403:
        res.status(401).send({ message: err.message });
        console.log("403 in errorHandler", err.status);
        break;
  
      case 404:
        res.status(404).send({ success: false, message: err.message });
        console.log("404 in errorHandler", err.status);
        break;
  
      default:
        console.log("500 in errorHandler", err.status);
        console.log("ERROR:",err) // <---- DELETE ME LATER
        res.status(500).send({ message: "Generic Server Error - Error Logged - We're on our way to fix it!" });
    }
  }
  
  export default errorHandler;
  
  