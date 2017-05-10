const rp = require('request-promise');
const urls = require('../routes/urls');
const Vivienda = require('../models/vivienda');

module.exports = {
  /**
  * This functions renders de house view with all of its images
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.
  */   
  houseView: function(request, response) {
    return Vivienda.find({estudioId: request.session.estudioId})
      .then((aV) => {
        return response.render('house', {
          images: aV
        });
      });
  },
  /**
  * This function saves a created Job
  * 
  * @event
  * @param {object} request - request object 
  * @param {object} response - response object.  
  */   
  uploadHouse: function(request, response) {
    //set image path
    const imagePath = request.file.filename;
    // set image name
    const imageName = request.body.imageName;
    //get estudioId
    const estudioId = request.session.estudioId;
    let myImage = this.saveImage(imagePath, imageName, estudioId);
    return myImage.save()
      .then((newImage) => {
        // console.log(newImage);
        return this.houseView(request, response);
      });
  },
  /**
  * This function saves an Image
  * 
  * @event
  * @param {string} path - path of the image file
  * @param {string} imageName - name of the image 
  * @param {string} estudioId - id of the estudio.
  *
  */
  saveImage: function(path, imageName,estudioId) {
    // console.log(path, familyId);
    return Vivienda.create({
      estudioId: estudioId,
      path: path,
      name: imageName,
    });
  },
}