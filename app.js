var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const adminAuth = require('./middlewares/admin-auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminArticleRouter = require('./routes/admin/articles')
const adminCategoryRouter = require('./routes/admin/categories')
const adminSettingRouter = require('./routes/admin/settings')
const adminUserRouter = require('./routes/admin/users')
const adminCourseRouter = require('./routes/admin/courses')
const adminAuthRouter = require('./routes/admin/auth');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/articles', adminAuth, adminArticleRouter);
app.use('/admin/categories', adminAuth, adminCategoryRouter);
app.use('/admin/settings', adminAuth, adminSettingRouter);
app.use('/admin/users', adminAuth, adminUserRouter);
app.use('/admin/courses', adminAuth, adminCourseRouter);
app.use('/admin/auth', adminAuthRouter);

module.exports = app;
