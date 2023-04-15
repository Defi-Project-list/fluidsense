import {
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";
import React from "react";

interface AlertInterface {
  type: string;
  hash?: string;
  message: string;
  getCloseAlert: (closeAlert: boolean) => void;
}

export default function Alert({
  type,
  message,
  hash,
  getCloseAlert,
}: AlertInterface) {
  return (
    <div
      className={
        type === "success"
          ? "rounded-md bg-green-50 p-4"
          : type === "fail"
          ? "rounded-md bg-red-50 p-4"
          : "rounded-md bg-blue-50 p-4"
      }
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === "success" ? (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          ) : type === "fail" ? (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          ) : (
            <InformationCircleIcon
              className="h-5 w-5 text-blue-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          <p
            className={
              type === "success"
                ? "text-sm font-medium text-green-800 flex items-center"
                : type === "fail"
                ? "text-sm font-medium text-red-800 flex items-center"
                : "text-sm font-medium text-blue-800 flex items-center"
            }
          >
            {message}
            {hash && (
              <a href={`https://polygonscan.com/tx/${hash}`} target="_blank">
                <ArrowTopRightOnSquareIcon
                  className={
                    type === "success"
                      ? "h-4 w-4 text-green-800 ml-1"
                      : type === "fail"
                      ? "h-4 w-4 text-red-800 ml-1"
                      : "h-4 w-4 text-blue-800 ml-1"
                  }
                  aria-hidden="true"
                />
              </a>
            )}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={
                type === "success"
                  ? "inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  : type === "fail"
                  ? "inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  : "inline-flex rounded-md bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50"
              }
            >
              <XMarkIcon
                className="h-5 w-5"
                aria-hidden="true"
                onClick={() => getCloseAlert(true)}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
