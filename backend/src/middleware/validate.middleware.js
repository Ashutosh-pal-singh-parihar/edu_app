export const validate = (schema)=> (req, res, next) =>{
    const { error } =   schema.validate(req.body)
    if(error){
        throw new Error("enter valid input")
    }
    next()
}