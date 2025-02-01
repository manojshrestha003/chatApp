import React, { useEffect, useState } from 'react'
import './ProfileUpdata.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../config/Firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../lib/Upload'

const ProfileUpdate = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")  // Corrected variable name
  const [uid, setUid] = useState("")
  const [prevImg, setPrevImg] = useState("")

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImg && !image) {
        toast.error("Upload Profile picture")
      }
      const docRef = doc(db, 'users', uid)
      if (image) {
        const imageUrl = await upload(image);  // Upload the image and get URL
        setPrevImg(imageUrl)
        await updateDoc(docRef, {
          avatar: imageUrl,
          bio: bio,
          name: name
        })
      }
      else {
        await updateDoc(docRef, {
          bio: bio,
          name: name
        })
      }
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name)
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio)  // Corrected variable name
        }
        if (docSnap.data().avatar) {
          setPrevImg(docSnap.data().avatar)
        }
      } else {
        navigate('/')
      }
    })
  }, [navigate])

  const [image, setImage] = useState(false)

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => { setImage(e.target.files[0]) }} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : prevImg || assets.avatar_icon} alt="" />
            upload profile image
          </label>
          <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" placeholder='Your Name' required />
          <textarea onChange={(e) => { setBio(e.target.value) }} value={bio} placeholder='Bio ' required></textarea> {/* Corrected bio handler */}
          <button type="submit"> Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImg || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
