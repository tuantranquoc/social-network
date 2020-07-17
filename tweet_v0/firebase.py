import base64
import time
from datetime import timedelta
import zlib
from uuid import uuid4
from django.contrib.auth import get_user_model
from pytz import unicode

from profiles.models import Profile

User = get_user_model()

import firebase_admin
from firebase_admin import credentials

from firebase_admin import firestore, initialize_app

__all__ = ['send_to_firebase', 'update_firebase_snapshot']

cred = credentials.Certificate("django-file-storage-firebase-adminsdk-eb75b-37a95991fd.json")
firebase_admin.initialize_app(cred)
code = ""


def send_to_firebase(data):
    db = firestore.client()
    # start = time.time()
    # db.collection('notifications').document(str(uuid4())).create(raw_notification)
    # end = time.time()
    # spend_time = timedelta(seconds=end - start)
    # return spend_time
    user = User.objects.first()
    profile = Profile.objects.get(user=user)
    compressed_data = zlib.compress(profile.background.read())
    b64_img = base64.b64encode(compressed_data)
    doc_ref = db.collection(u'background').document("2".__str__())
    doc_ref.set({
        u'username': user.username,
        u'background': profile.background.read()
    })

    print("len", profile.background.read())
    print("len", len(compressed_data))

    users_ref = db.collection(u'background').document('2')
    get_bal = users_ref.get({u'background'})
    x = u'{}'.format(get_bal.to_dict()['background'])

    users_ref = db.collection(u'background').document('2')
    get_bal = users_ref.get({u'username'})
    bal = u'{}'.format(get_bal.to_dict()['username'])

    c = unicode(compressed_data, errors='replace')
    d = c.encode('utf-8')
    print(type(d), d[0:10])
    print(compressed_data[0:10])
    print(bytes(x[0:30], 'utf-8'))

    decompressed_byte_data = zlib.decompress(d)
    # image_result = open('deer_decode_f.jpg', 'wb')  # create a writable image and write the decoding result
    # image_result.write(decompressed_byte_data)

    # b64_img_de = base64.b64decode(x[2:-1])
    # image_result = open('deer_decode_e.jpg', 'wb')  # create a writable image and write the decoding result
    # image_result.write(b64_img_de)


def read_from_firebase():
    db = firestore.client()
    users_ref = db.collection(u'background')
    docs = users_ref.stream()
    data = {}
    for doc in docs:
        data = f'{doc.to_dict()}'
        # print(f'{doc.id} => {doc.to_dict()}')

    users_ref = db.collection(u'background').document('2')
    get_bal = users_ref.get({u'username'})
    bal = get_bal['username']
    print(bal)

    # if code == bal:
    #     b64_img_de = base64.b64decode(bal)
    #     image_result = open('deer_decode_hs.jpg', 'wb')  # create a writable image and write the decoding result
    #     image_result.write(b64_img_de)


def update_firebase_snapshot(snapshot_id):
    start = time.time()
    db = firestore.client()
    db.collection('notifications').document(snapshot_id).update(
        {'is_read': True}
    )
    end = time.time()
    spend_time = timedelta(seconds=end - start)
    return spend_time


def send_profile_background_avatar_to_firebase():
    db = firestore.client()
    users = User.objects.all()
    profiles = Profile.objects.all()
    for profile in profiles:
        b64_img = base64.b64encode(profile.background.read())

        if len(b64_img) >= 1048487:
            print("profile", len(b64_img), 1048487, profile)
        if b64_img <= bytes(1048487):
            print("detect")
            b64_avt = base64.b64encode(profile.avatar.read())
            doc_ref = db.collection(u'background').document(profile.id.__str__())
            doc_ref.set({
                u'username': profile.user.username,
                u'background': b64_img,
                u'avatar': b64_avt,
            })
