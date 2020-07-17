from django.core.exceptions import ValidationError


def validate_min_length(value):
    if value.length < 3:
        raise ValidationError("Minimum length > 3")
    else:
        return value