import React from "react";
import { toast } from "react-toastify";

const ALERT_DELAY_MS = 10000;

const commonProps = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: ALERT_DELAY_MS,
  closeButton: false
};

function getCommonAlert(title, message, id = undefined, anchor = null) {
  return (
    <div className="toast-common" role="alert">
      <h2 id={id} tabIndex={-1}>
        {title}
      </h2>
      <div>{message}</div>
      {anchor && <a href={anchor.link}>{anchor.text}</a>}
    </div>
  );
}

function alertInfo(message, title) {
  toast.info(getCommonAlert(title, message), commonProps);
}

function alertSuccess(message, title, id = undefined) {
  toast.success(getCommonAlert(title, message, id), commonProps);
}

function alertError(message, title, id = undefined, anchor = null) {
  toast.error(getCommonAlert(title, message, id), commonProps, anchor);
}

function alertWarning(message, title) {
  toast.warn(getCommonAlert(title, message), commonProps);
}

function focusOnAlert(id) {
  setTimeout(() => {
    const alert = document.getElementById(id);
    if (alert) {
      alert.focus();
    }
  }, 0);
}

export { alertInfo, alertSuccess, alertWarning, alertError, focusOnAlert };
