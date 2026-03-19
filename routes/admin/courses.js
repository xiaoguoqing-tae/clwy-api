var express = require('express');
var router = express.Router();
const { Op } = require('sequelize')
const { success, failure } = require('../../utils/response')
const { NotFoundError } = require('../../utils/errors')
const { Course, Category, User } = require('../../models');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const query = req.query
    const currentPage = Math.abs(parseInt(query.currentPage)) || 1
    const pageSize = Math.abs(parseInt(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize
    const condition = {
      attributes: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    };
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId
        }
      };
    }

    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId
        }
      };
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      };
    }

    if (query.recommended) {
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === 'true'
        }
      };
    }

    if (query.introductory) {
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === 'true'
        }
      };
    }

    const { count, rows: articles } = await Course.findAndCountAll(condition)
    success(res, '查询课程列表成功', { articles, count, currentPage, pageSize })
  } catch (error) {
    failure(res, error, '查询课程列表失败')
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const course = await Course.findByPk(id)
    if (!course) {
      throw new NotFoundError(`ID: ${id}的课程未找到`)
    }
    success(res, '查询成功', { course })
  } catch (error) {
    failure(res, error, '查询失败')
  }
});

router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const course = await Course.create(body)
    success(res, '新增成功', course, 201)
  } catch (error) {
    failure(res, error, '新增失败')
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const course = await Course.findByPk(id)
    if (!course) {
      throw new NotFoundError(`ID: ${id}的课程未找到`)
    }
    course.destroy()
    success(res, '删除成功')
  } catch (error) {
    failure(res, error, '删除失败')
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const body = filterBody(req)
    const course = await Course.findByPk(id)
    if (!course) {
      throw new NotFoundError(`ID: ${id}的课程未找到`)
    }
    course.update(body)
    success(res, '修改成功', course)
  } catch (error) {
    failure(res, error, '修改失败')
  }
});

//白名单
/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  };
}


module.exports = router;