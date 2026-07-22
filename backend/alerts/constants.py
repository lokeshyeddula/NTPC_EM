from enum import Enum


class AlertType(str, Enum):
    MACHINERY_FAILURE = "machinery_failure"
    OPERATOR_NON_COMPLIANCE = "operator_non_compliance"