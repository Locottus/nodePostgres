

const getImage = (request, response) => {
    const imageName = request.params.imageName;
    console.log(imageName);
    response.status(200).json(request.file);
  }

  
const postImage = (request, response) => {
  console.log(request.file);
  response.status(201).send(request.file);
}




module.exports = {
    getImage,
    postImage
  }
  