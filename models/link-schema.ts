import * as yup from 'yup'

const linkSchema=yup.object({
    name : yup.string().required(),
    url : yup.string().url().required(), 
    email : yup.string().email(),
    enabled : yup.boolean().default(() => {
        return true;
    }),
    views : yup.number().default(()=>{
        return 0;
    }),
    clicks : yup.number().default(()=>{
        return 0;
    }),
    createdAt: yup.number().default(()=>{
        return +new Date();
    }),
    updatedAt: yup.number().default(()=>{
        return +new Date();
    }), 
})