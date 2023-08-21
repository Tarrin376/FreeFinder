export const SERVICE_FEE = 0.05;
export const VALID_DURATION_DAYS = 4;
export const MAX_DEPOSIT = 500;
export const MAX_FILE_BYTES = 5000000;
export const MAX_MESSAGE_FILE_UPLOADS = 3;
export const MAX_SELLER_DESC_CHARS = 650;
export const MAX_SELLER_SUMMARY_CHARS = 50;
export const MAX_SELLER_SKILLS = 15;
export const MAX_REVIEW_CHARS = 650;
export const MIN_PASS_LENGTH = 8;
export const MAX_PASS_LENGTH = 256;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;
export const MAX_EMAIL_LENGTH = 320;
export const EMAIL_REGEX = new RegExp("[a-z0-9]+@[a-zA-Z]+[.][a-z]+$");
export const MAX_PROFILE_PIC_BYTES = 1000000;
export const MAX_SERVICE_PRICE = 2500;
export const MAX_SERVICE_DELIVERY_DAYS = 60;
export const MAX_SERVICE_FEATURES = 10;
export const ABOUT_SERVICE_LIMIT = 1150;
export const SERVICE_TITLE_LIMIT = 100;
export const REVISIONS = ["1", "2", "3", "4", "5", "unlimited"];
export const MAX_SERVICE_IMAGE_UPLOADS = 20;
export const SUPPORTED_IMAGE_FORMATS = [
    'png',
    'jpeg',
    'webp'
];
export const SUPPORTED_FILE_FORMATS = {
    "image": "image",
    "video": "video",
    "audio": "audio",
    "text/csv": "csv",
    "text/plain": "txt",
    "application/json": "json",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx"
};
