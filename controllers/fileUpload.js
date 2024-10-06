const cloudinary = require('cloudinary').v2

// Functions

const isFileTypeSuppported = (currentType, supportedTypes) => {
  return supportedTypes.includes(currentType)
}

const uploadFileToCloudinary = async (file, folder, quality) => {
  console.log("Uploading To CodeHelp Folder");
  const options = { folder }

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options)
}

exports.imageUpload = async (req, res) => {
  try {

    const file = req.files.imageFile;

    const supportedTypes = ['jpg', 'jpeg', 'png']
    const fileType = file.name.split('.')[1].toLowerCase();

    if (!isFileTypeSuppported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid File Formate"
      })
    }

    const response = await uploadFileToCloudinary(file, "CrowdEstate")

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image Uploaded SuccessFully"
    })

  } catch (error) {
    console.error(error)
    return res.status(400).json({
      success: false,
      message: "Something Went wrong while uplpoding Image"
    })
  }
}

exports.videoUpload = async (req, res) => {
  try {

    const file = req.files.videoFile;

    console.log('file', file)

    const supportedTypes = ['mp4', 'avi', 'mki']
    const fileType = file.name.split('.')[1].toLowerCase();

    if (!isFileTypeSuppported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid File Formate"
      })
    }

    console.log("++++Uploading File ++++ \n");
    const response = await uploadFileToCloudinary(file, "CrowdEstate")
    console.log("++++File Uploaded ++++ \n");
    console.log('response', response)

    res.json({
      success: true,
      videoUrl: response.secure_url,
      message: "Video Uploaded SuccessFully"
    })


  } catch (error) {
    console.error(error)
    return res.status(400).json({
      success: false,
      message: "Something Went wrong while uplpoding Video"
    })
  }
}

exports.imageReducerUpload = async (req, res) => {
  try {

    const file = req.files.imageFile;

    const supportedTypes = ['jpg', 'jpeg', 'png']
    const fileType = file.name.split('.')[1].toLowerCase();

    if (!isFileTypeSuppported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid File Formate"
      })
    }

    const response = await uploadFileToCloudinary(file, "CrowdEstate", 50)

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image Reduced and Uploaded SuccessFully"
    })

  } catch (error) {
    console.error(error)
    return res.status(400).json({
      success: false,
      message: "Something Went wrong while Image Reduction"
    })
  }
}