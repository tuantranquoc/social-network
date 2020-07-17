from captcha import widgets
from captcha.widgets import ReCaptchaV2Invisible
from django import forms
from captcha.fields import ReCaptchaField
from .models import Tweet

MAX_TWEET_LENGTH = 240


class TweetForm(forms.ModelForm):
    class Meta:
        model = Tweet
        fields = ["content"]

    def clean_content(self):
        content = self.cleaned_data.get("content")
        if len(content) > MAX_TWEET_LENGTH:
            raise forms.ValidationError("This tweet is too long!")
        return content



