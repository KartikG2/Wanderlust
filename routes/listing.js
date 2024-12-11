const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer'); 
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//===================INDEX ROUTE  n  CREATE ROUTE=======================
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);

//================= NEWROUTE===============
router.get("/new",isLoggedIn,listingController.renderNewForm);

//==================SHOW ROUTE n UPDATE ROUTE n DELETE ROUTE  =======================
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing))
.delete(isLoggedIn
  ,isOwner,
  wrapAsync(listingController.destoryListing)
);

//=================EDIT ROUTE================
router.get("/:id/edit",isLoggedIn,isOwner,
  wrapAsync(listingController.renderEditForm));

module.exports = router;