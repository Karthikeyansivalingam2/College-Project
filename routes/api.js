const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// 1. Shops
router.get('/shops', apiController.getShops);
router.get('/search', apiController.searchShops);

// 2. Auth
router.post('/login', apiController.login);
router.post('/signup', apiController.signup);

// 3. Order
router.post('/order', apiController.placeOrder);
router.get('/order/:id', apiController.getOrderById);
router.get('/user-orders', apiController.getUserOrders);
router.post('/order/status', apiController.updateOrderStatus);

// 4. Enquiry & Job
router.post('/enquire', apiController.enquire);
router.post('/apply/job', apiController.applyJob);

// 5. Partner
router.post('/apply/partner', apiController.applyPartner);
router.post('/partner/login', apiController.partnerLogin);
router.get('/partner/dashboard/:id', apiController.getPartnerDashboard);
router.post('/partner/status', apiController.updatePartnerStatus);

// 6. Admin
router.get('/admin/data', apiController.getAdminData);

// 7. Menu
router.get('/menu', apiController.getMenu);
router.post('/menu/update', apiController.updateMenu);
router.post('/menu/add', apiController.addMenu);

module.exports = router;
