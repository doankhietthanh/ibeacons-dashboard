export enum STATUS_RESPONSE {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export enum SUCCESS_MESSAGE {
  CREATED_SUCCESS = "Created success.",
  UPDATED_SUCCESS = "Updated success.",
  DELETED_SUCCESS = "Deleted success.",
}

export enum ERROR_MESSAGE {
  USER_NOT_FOUND = "User not found.",
  CREATED_FAILED = "Failed to create. Please try again.",
  UPDATED_FAILED = "Failed to update. Please try again.",
  DELETED_FAILED = "Failed to delete. Please try again.",
  GET_FAILED = "Failed to get. Please try again.",
  PERMISSION_DENIED = "Permission denied.",
}

export enum LOCAL_STORAGE_KEY {
  TOTAL_ROOMS = "total_rooms",
  TOTAL_DEVICES = "total_devices",
}
