var express = require('express');
var router = express.Router();
const { User } = require('../../models')
const { Op } = require('sequelize')
const { success, failure } = require('../../utils/response')
const { NotFoundError } = require('../../utils/errors')
const bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const query = req.query
    const currentPage = Math.abs(parseInt(query.currentPage)) || 1
    const pageSize = Math.abs(parseInt(query.pageSize)) || 10
    const condition = {
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }
    if (query.email) {
      condition.where = {
        email: {
          [Op.eq]: query.email
        }
      };
    }

    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username
        }
      };
    }

    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${query.nickname}%`
        }
      };
    }

    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role
        }
      };
    }
    const { count, rows: articles } = await User.findAndCountAll(condition)
    success(res, '查询用户列表成功', { articles, count, currentPage, pageSize })
  } catch (error) {
    failure(res, error, '查询用户列表失败')
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError(`ID: ${id}的用户未找到`)
    }
    success(res, '查询成功', { user })
  } catch (error) {
    failure(res, error, '查询失败')
  }
});

router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    body.password = bcrypt.hashSync(body.password, 10);
    const user = await User.create(body)
    success(res, '新增成功', user, 201)
  } catch (error) {
    failure(res, error, '新增失败')
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError(`ID: ${id}的用户未找到`)
    }
    user.destroy()
    success(res, '删除成功')
  } catch (error) {
    failure(res, error, '删除失败')
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const body = filterBody(req)
    body.password = bcrypt.hashSync(body.password, 10);
    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError(`ID: ${id}的用户未找到`)
    }
    user.update(body)
    success(res, '修改成功', user)
  } catch (error) {
    failure(res, error, '修改失败')
  }
});

//白名单
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar
  };
}

module.exports = router;