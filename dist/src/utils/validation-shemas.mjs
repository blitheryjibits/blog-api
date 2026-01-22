import { checkSchema, param } from 'express-validator';

// authentication for users registering, signing in, or updating data

export const authSchema = checkSchema({
// username validation
  username: {
    in: ['body'],
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
    isLength: {
      options: { min: 3, max: 30 },
      errorMessage: 'Username must be between 3 and 30 characters',
    },
    isAlphanumeric: {
      errorMessage: 'Username must contain only letters and numbers',
    },
    trim: true,
    escape: true,
  },
//   email validation
   email: {
    in: ['body'],
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
    trim: true,
  },
//   password validation
  password: {
    in: ['body'],
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      errorMessage:
        'Password must include at least one uppercase letter, one number, and one special character',
    },
  },
});


// post schema
export const postSchema = checkSchema({
  title: {
    in: ['body'],
    isString: {
      errorMessage: "Title must be a string"
    },
    isLength: { min: 2, max: 128 },
    errorMessage: "Title needs to be between 2 and 128 characters"
  },
  escape: true,
  content: {
    in: ['body'],
    isString: {
      errorMessage: "Content can only contain string type data"
    },
    isLength: { 
      options: {max: 1000},
      message: "Content length must be less than 1000 characters"
    },
    escape: true
  },
  published: {
    in: ['body'],
      optional: {
      options: { nullable: true, checkFalsy: true }
    },
    toBoolean: true,
    custom: {
      options: value => typeof value === 'boolean',
      errorMessage: 'Published must be a boolean such as true, True or "True"'
    }
  },
})

export const postIdParam = [
  param('postId')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Post ID must be a positive integer')
];

export const commentIdParam = [
  param('commentId')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Comment ID must be a positive integer')
]

export const commentSchema = checkSchema({
  content: {
    in: ['body'],
    isString: {
      errorMessage: "Comments can only be a string"
    },
    isLength: { min: 1, max: 128 },
    errorMessage: "Comment needs to be between 1 and 128 characters"
  },
  escape: true,
})