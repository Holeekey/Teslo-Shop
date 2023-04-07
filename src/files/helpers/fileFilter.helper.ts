export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback:Function) => {

    if(!file) return callback(new Error('File is empty'),false);

    const fileExtension =  file.mimetype.split('/')[1];
    const validExtension = ['jpeg','jpg','gif','png'];

    if(!validExtension.includes(fileExtension)) 
        return callback(new Error('Not valid extension'),false);

    callback(null,true);

}