const accountsModel = require('./accounts-model');
const yup = require("yup");

const accountScheme = yup.object().shape({
  name: yup.string()
  .min(3, "name of account must be between 3 and 100")
  .max(100, "name of account must be between 3 and 100")
  .required("name and bugget are required"),
budget: yup.number("budget of account must be a number")
.min(0, "budget of account is too large or too small")
.max(1000000, "budget of account is too large or too small")
.required("name and bugget are required")
})

exports.checkAccountPayload = async(req, res, next) => {
  // KODLAR BURAYA
  // Not: Validasyon için Yup(şu an yüklü değil!) kullanabilirsiniz veya kendiniz manuel yazabilirsiniz.
  try {
    const {budget,name } =req.body;
    if(budget === undefined || name === undefined){
      res.status(400).json({message:"name and budget are required"});
    }else {
      if(req.body.name)
      req.body.name = req.body.name.trim();
      if(name.length<3 || name.length>100){
        res.status(400).json({message:"name of account must be between 3 and 100"});
      } else if(typeof budget !== "number"){
        res.status(400).json({message:"budget of account must be a number"});
      } else if (budget<0 || budget >100000){
        res.status(400).json({message:"budget of account is too larger or too small"});
      } else{
        next();
      }
      //await accountScheme.validate(req.body);
    }
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}

exports.checkAccountNameUnique = async(req, res, next) => {
  // KODLAR BURAYA
  try {
    let isExist= false;
    const accountExist = await accountsModel.getAll();
    for (let i = 0; i< accountExist.lengt; i++) {
      const item =accountExist[i];
      if(item.name == req.body.name){
isExist=true;
break;
      }
    }
    if(isExist){
      res.status(400).json({message:"that name is token"});
    }
  } catch (error) {
    next(error);
  }
}

exports.checkAccountId =async (req, res, next) => {
  // KODLAR BURAYA
  try {
    const existAccount = await accountsModel.getById(req.params.id);
    if(!existAccount){
    res.status(404).json({message:"account not found"});
  }else {
    req.existAccount= existAccount;
    next();
  }
 } catch (error) {
    next(error);
  }
}
