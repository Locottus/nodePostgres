


const getFile = (request, response) => {
  const imageName = request.query.imageName;
  console.log(imageName);
  response.status(200).json(request.file);

}


const postFile = (request, response) => {
  console.log(request.file);
  response.status(201).send(request.file);
}




module.exports = {
  getFile,
  postFile
}
