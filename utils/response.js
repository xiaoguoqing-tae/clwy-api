/**
 * 统一响应封装
 */

/**
 * 成功响应
 * @param {Object} res - Express response 对象
 * @param {string} message - 提示信息
 * @param {Object} data - 返回数据
 * @param {number} code - HTTP 状态码，默认 200
 */
function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data
  })
}

/**
 * 失败响应
 * @param {Object} res - Express response 对象
 * @param {Error} error - 错误对象
 * @param {string} message - 提示信息
 */
function failure(res, error, message = '操作失败') {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message)
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      errors
    })
  }
  if (error.name === 'BadRequestError') {
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      errors: [error.message]
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: [error.message]
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      status: false,
      message: '资源不存在',
      errors: [error.message]
    })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: ['您提交的 token 错误。']
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: ['您的 token 已过期。']
    });
  }

  res.status(500).json({
    status: false,
    message,
    errors: [error.message]
  })
}

module.exports = {
  success,
  failure
}
