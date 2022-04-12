module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '90fd1300a73309ce15c4df93fd980112'),
  },
});
