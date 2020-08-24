const { check, body } = require("express-validator");
const Mood = require("../models/mood");
const Song = require("../models/song");
const User = require("../models/user");
const Subscriptionplan = require("../models/subscriptionPlan");

exports.validate = method => {
  switch (method) {
    case "userLogin": {
      return [
        check("email")
          .isEmail()
          .withMessage("Email is not valid"),
        check("password")
          .isLength({ min: 1 })
          .withMessage("Password cannot be empty")
      ];
    }
    case "userSignup": {
      return [
        check("firstName").isLength({ min: 1 }),
        check("lastName").isLength({ min: 1 }),
        check("email")
          .isEmail()
          .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
              User.findOne({ email: req.body.email }, function(err, user) {
                if (err) {
                  reject(new Error("Server Error"));
                }
                if (Boolean(user)) {
                  reject(new Error("Email already registered"));
                }
                resolve(true);
              });
            });
          }),
        check("password").isLength({ min: 1 }),
        check("mobile")
          .not()
          .isEmpty()
          .withMessage("Mobile Field cannot be blank")
          .bail()
          .isInt()
          .withMessage("Mobile number should not be in form of string")
          .bail()
          .isLength({ min: 10, max: 10 })
          .withMessage("Mobile number should be of 10 digit")
      ];
    }
    case "verifyAccount": {
      return [
        check("otp")
          .not()
          .isEmpty()
          .withMessage("OTP Field cannot be blank")
          .bail()
          .isInt()
          .withMessage("OTP should not be in form of string")
          .bail()
          .isLength({ min: 4, max: 4 })
          .withMessage("OTP should be of 4 digit only")
      ];
    }
    // case "verifyOTP": {
    //   return [
    //     check("mobile")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Mobile Field cannot be blank")
    //       .bail()
    //       .isInt()
    //       .withMessage("Mobile number should not be in form of string")
    //       .bail()
    //       .isLength({ min: 10, max: 10 })
    //       .withMessage("Mobile number should be of 10 digit"),
    //     check("otp")
    //       .not()
    //       .isEmpty()
    //       .withMessage("OTP field cannot be blank")
    //       .bail()
    //       .isInt()
    //       .withMessage("OTP should not be in form of string")
    //       .bail()
    //       .isLength({ min: 4, max: 4 })
    //       .withMessage("OTP should be of 4 digit")
    //   ];
    // }
    // case "vendorMarkOnline": {
    //   // const verified =  verify(req, res, next);
    //   return [
    //     // body("id")
    //     //   .exists()
    //     //   .isMongoId()
    //     // .custom((value, { req }) => {
    //     //   return new Promise((resolve, reject) => {
    //     //     Vendor.findOne({ _id: req.body.id }, function(err, user) {
    //     //       if (err) {
    //     //         reject(new Error("Server Error"));
    //     //       }
    //     //       if (!Boolean(user)) {
    //     //         reject(new Error("No user found for given id"));
    //     //       }
    //     //       resolve(true);
    //     //     });
    //     //   });
    //     // })
    //     check("isOnline")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Input is required")
    //   ];
    // }
    // case "vendorValid": {
    //   return [
    //     // body("id")
    //     //   .exists()
    //     //   .isMongoId()
    //     //   .custom((value, { req }) => {
    //     //     return new Promise((resolve, reject) => {
    //     //       User.findOne({ _id: req.body.id }, function(err, user) {
    //     //         if (err) {
    //     //           reject(new Error("Server Error"));
    //     //         }
    //     //         if (!Boolean(user)) {
    //     //           reject(new Error("No user found for given id"));
    //     //         }
    //     //         resolve(true);
    //     //       });
    //     //     });
    //     //   })
    //   ];
    // }
    // case "orderValid": {
    //   return [
    //     check("orderId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Order is Is Required")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("OrderId is not valid")
    //   ];
    // }
    // case "orderValidDeliveryBoy": {
    //   return [
    //     check("orderId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Order is Is Required")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("OrderId is not valid"),
    //     check("deliveryboyId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("deliveryboy is required")
    //       .isMongoId()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Deliveryboy.findOne({ _id: req.body.deliveryboyId }, function(
    //             err,
    //             user
    //           ) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(user)) {
    //               reject(new Error("No user found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       })
    //   ];
    // }
    // case "ListOrderByDelBoy": {
    //   return [
    //     check("orderId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Order is Is Required")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("OrderId is not valid"),
    //     check("deliveryboyId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("deliveryboy is required")
    //       .isMongoId()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Deliveryboy.findOne({ _id: req.body.deliveryboyId }, function(
    //             err,
    //             user
    //           ) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(user)) {
    //               reject(new Error("No user found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       })
    //   ];
    // }
    // case "vendorProdSubscribe": {
    //   return [
    //     check("firstname").isLength({ min: 1 }),
    //     check("lastname").isLength({ min: 1 }),
    //     check("mobile")
    //       .isInt()
    //       .isLength({ min: 10, max: 10 }),
    //     check("password").isLength({ min: 1 })
    //   ];
    // }
    // case "userValid": {
    //   return [
    //     // body("id")
    //     //   .exists()
    //     //   .isMongoId()
    //     //   .custom((value, { req }) => {
    //     //     return new Promise((resolve, reject) => {
    //     //       User.findOne({ _id: req.body.id }, function(err, user) {
    //     //         if (err) {
    //     //           reject(new Error("Server Error"));
    //     //         }
    //     //         if (!Boolean(user)) {
    //     //           reject(new Error("No user found for given id"));
    //     //         }
    //     //         resolve(true);
    //     //       });
    //     //     });
    //     //   })
    //   ];
    // }
    // case "addSong": {
    //   return [
    //     check("productType")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Product type cannot be blank")
    //       .isMongoId()
    //       .withMessage("Invalid Product type")
    //       .bail()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Category.findOne({ _id: req.body.productType }, function(
    //             err,
    //             category
    //           ) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(category)) {
    //               reject(new Error("No category found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       })
    //   ];
    // }
    // case "productById": {
    //   return [
    //     check("productId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("productId cannot be blank")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("ProductId is not a valid id")
    //   ];
    // }
    // case "catProduct": {
    //   return [
    //     check("productType")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Product type cannot be blank")
    //       .isMongoId()
    //       .withMessage("Invalid Product type")
    //       .bail()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Category.findOne({ _id: req.body.productType }, function(
    //             err,
    //             category
    //           ) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(category)) {
    //               reject(new Error("No category found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       })
    //   ];
    // }
    // case "updateProduct": {
    //   return [];
    // }
    // case "activateProduct": {
    //   return [
    //     check("productId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("ProductId cannot be blank")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("ProductId is not a valid id"),
    //     check("isActive")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Select value to activate/deactivate")
    //   ];
    // }
    // case "activateCat": {
    //   return [
    //     check("categoryId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Product type cannot be blank")
    //       .isMongoId()
    //       .withMessage("Invalid CategoryId")
    //       .bail()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Category.findOne({ _id: req.body.categoryId }, function(
    //             err,
    //             category
    //           ) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(category)) {
    //               reject(new Error("No category found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       }),
    //     check("isEnabled")
    //       .not()
    //       .isEmpty()
    //       .withMessage("isEnabled field missing")
    //       .isBoolean()
    //   ];
    // }
    // case "updateCat": {
    //   return [
    //     check("categoryId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Product type cannot be blank")
    //       .isMongoId()
    //       .withMessage("Invalid CategoryId")
    //       .bail()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Category.findOne({ _id: req.body.categoryId }, function(
    //             err,
    //             category
    //           ) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(category)) {
    //               reject(new Error("No category found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       }),
    //     check("isEnabled")
    //       .not()
    //       .isEmpty()
    //       .withMessage("isEnabled field missing")
    //       .isBoolean()
    //   ];
    // }
    // case "addCat": {
    //   return [
    //     check("categoryName")
    //       .not()
    //       .isEmpty()
    //       .withMessage("CategoryName Cannot be blank")
    //   ];
    // }
    // case "addCoupon": {
    //   return [
    //     check("couponCode")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Coupon code Cannot be blank"),
    //     check("discount")
    //       .not()
    //       .isEmpty()
    //       .withMessage("discount Cannot be blank")
    //       .isInt()
    //       .withMessage("discount field cannot be string")
    //     // check("categoryName")
    //     //   .not()
    //     //   .isEmpty()
    //     //   .withMessage("CategoryName Cannot be blank"),
    //     // check("categoryName")
    //     //   .not()
    //     //   .isEmpty()
    //     //   .withMessage("CategoryName Cannot be blank"),
    //     // check("categoryName")
    //     //   .not()
    //     //   .isEmpty()
    //     //   .withMessage("CategoryName Cannot be blank")
    //   ];
    // }
    // case "listCouponId": {
    //   return [
    //     check("couponId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Product type cannot be blank")
    //       .isMongoId()
    //       .withMessage("Invalid CategoryId")
    //       .bail()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Coupon.findOne({ _id: req.body.couponId }, function(err, coupon) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(coupon)) {
    //               reject(new Error("No coupon found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       })
    //   ];
    // }
    // case "updateCoupon": {
    //   return [];
    // }
    // case "activateCoupon": {
    //   return [
    //     check("couponId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Coupon Id cannot be blank")
    //       .isMongoId()
    //       .withMessage("Invalid Coupon Id")
    //       .bail()
    //       .custom((value, { req }) => {
    //         return new Promise((resolve, reject) => {
    //           Coupon.findOne({ _id: req.body.couponId }, function(err, coupon) {
    //             if (err) {
    //               reject(new Error("Server Error"));
    //             }
    //             if (!Boolean(coupon)) {
    //               reject(new Error("No coupon found for given id"));
    //             }
    //             resolve(true);
    //           });
    //         });
    //       }),
    //     check("isActive")
    //       .not()
    //       .isEmpty()
    //       .withMessage("isActive field missing")
    //       .isBoolean()
    //   ];
    // }
    // case "addToCart": {
    //   return [
    //     check("cartDetail.productId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("cart cannot be empty ")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("product Id is not valid"),
    //     check("cartDetail").custom((value, { req }) => {
    //       return new Promise((resolve, reject) => {
    //         Product.findOne({ _id: req.body.cartDetail.productId }, function(
    //           err,
    //           product
    //         ) {
    //           if (err) {
    //             reject(new Error("Server Error"));
    //           }
    //           if (product.maxQuantity < req.body.cartDetail.quantity) {
    //             reject(
    //               new Error(
    //                 "product quantity cannot be more than " +
    //                   product.maxQuantity
    //               )
    //             );
    //           }
    //           resolve(true);
    //         });
    //       });
    //     })
    //     // .custom((value, { req }) => 5 >= req.body.cartDetail.quantity)
    //     // .withMessage("product cannot be more than 5")
    //   ];
    // }
    // case "updateProfile": {
    //   return [
    //     check("name")
    //       .not()
    //       .isEmpty()
    //       .withMessage("name field cannot be empty "),
    //     check("userType")
    //       .not()
    //       .isEmpty()
    //       .withMessage("usertype Field cannot be empty "),
    //     check("email")
    //       .optional()
    //       .isEmail()
    //       .withMessage("email is not valid ")
    //   ];
    // }
    // case "placeOrder": {
    //   return [
    //     check("deliveryAddressId")
    //       .not()
    //       .isEmpty()
    //       .withMessage("deliveryAddress cannot be blank")
    //       .bail()
    //       .isMongoId()
    //       .withMessage("deliveryAddressId is not a valid id"),
    //     check("payType")
    //       .not()
    //       .isEmpty()
    //       .withMessage("payType cannot be blank")
    //       .isIn(["COD", "PREPAID"])
    //       .withMessage("paytype is not valid")
    //   ];
    // }
  }
};
