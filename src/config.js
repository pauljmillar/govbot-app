export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    BUCKET: "notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
   //orig URL: "https://5by75p4gn3.execute-api.us-east-1.amazonaws.com/prod"
   //URL: "https://coz0ig8x51.execute-api.us-east-1.amazonaws.com/prod"
    URL: "https://jlpmalgb3k.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_pjBTwpxe8",
    APP_CLIENT_ID: "2ahapmpo1h2462c7978257m1qu",
    IDENTITY_POOL_ID: "us-east-1:4fb14d01-c595-4f08-aeb4-fb0489ca0bdb"
  }
};
