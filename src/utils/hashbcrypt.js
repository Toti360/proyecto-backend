import bcrypt from "bcrypt"; 

// createHash: aplica el hash al password. 
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 

const isValidPassword = ( password, user ) => bcrypt.compareSync(password, user.password); 
//Compara los password y retorna tru o false segun corresponda. 

export {createHash, isValidPassword}; 