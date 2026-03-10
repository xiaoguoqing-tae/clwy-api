var express = require('express');
var router = express.Router();
const { Article } = require('../../models')
const { Op } = require('sequelize')
const { success, failure } = require('../../utils/response')
const { NotFoundError } = require('../../utils/errors')

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
    if (query.title) {
      condition.where = {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query.title}%`
            }
          },
          {
            content: {
              [Op.like]: `%${query.title}%`
            }
          }
        ]
      }
    }
    const { count, rows: articles } = await Article.findAndCountAll(condition)
    success(res, '查询文字列表成功', { articles, count, currentPage, pageSize })
  } catch (error) {
    failure(res, error, '查询文字列表失败')
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFoundError(`ID: ${id}的文章未找到`)
    }
    success(res, '查询成功', { article })
  } catch (error) {
    failure(res, error, '查询失败')
  }
});

router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const article = await Article.create(body)
    success(res, '新增成功', article, 201)
  } catch (error) {
    failure(res, error, '新增失败')
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFoundError(`ID: ${id}的文章未找到`)
    }
    article.destroy()
    success(res, '删除成功')
  } catch (error) {
    failure(res, error, '删除失败')
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id } = req.params
    const body = filterBody(req)
    const article = await Article.findByPk(id)
    if (!article) {
      throw new NotFoundError(`ID: ${id}的文章未找到`)
    }
    article.update(body)
    success(res, '修改成功', article)
  } catch (error) {
    failure(res, error, '修改失败')
  }
});

//白名单
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content
  }
}

module.exports = router;