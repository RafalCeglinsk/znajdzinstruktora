import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  LeftProfileForm,
  FormGroup,
  Label,
  Input,
  TextArea,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxInput,
  InfoWrapper,
  Button,
  EditProfileWrapper,
  RightProfileForm,
  ProfilePictureLabel,
  Section,
  ContactWrapper,
  ImagePreview,
} from "./EdItInstructorProfile.styled";
import { selectUser } from "../../redux/auth/selectors";
import { editProfileConfig } from "../../hooks/editProfileConfig";
import {
  getInstructorById,
  updateInstructorProfile,
} from "../../redux/instructors/operations";
import { selectInstructors } from "../../redux/instructors/selectors";

export const InstructorProfile = () => {
  const user = useSelector(selectUser);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      classLevel: [],
      languages: [],
    },
  });
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(null);
  const { firstName, lastName } = user;
  const { classLevel, languages } = editProfileConfig();

  const instructor = useSelector(selectInstructors);
  const id = instructor.id;

  useEffect(() => {
    dispatch(getInstructorById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (instructor) {
      setValue("bio", instructor.bio || "");
      setValue("phoneNumber", instructor.phoneNumber || "");
      setValue("email", instructor.email || "");
      setValue("socialMedia", instructor.socialMedia || "");
      setValue("photo", instructor.photo || "");

      const classLevels = instructor.classLevel
        ? instructor.classLevel.map((level) => level.trim())
        : [];
      const languageLevels = instructor.languages
        ? instructor.languages.map((lang) => lang.trim())
        : [];

      setValue("classLevel", classLevels);
      setValue("languages", languageLevels);
    }
  }, [instructor, setValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("photo", file);
    } else {
      setValue("photo", null);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== "null" && data[key] !== "") {
        formData.append(key, data[key]);
      }
    }

    dispatch(updateInstructorProfile({ id, data: formData }));
  };

  const watchedClassLevel = watch("classLevel", []);
  const watchedLanguages = watch("languages", []);

  return (
    <Section>
      <EditProfileWrapper>
        <LeftProfileForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <ProfilePictureLabel>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <ImagePreview>
                {preview ? (
                  <img src={preview} alt="profile" />
                ) : (
                  <span>Wybierz zdjęcie</span>
                )}
              </ImagePreview>
            </ProfilePictureLabel>
          </FormGroup>
          <InfoWrapper>
            <FormGroup>
              <div>
                {firstName} {lastName}
              </div>
              <TextArea
                id="bio"
                {...register("bio")}
                rows="4"
                placeholder="Bio"
              />
            </FormGroup>
            <ContactWrapper>
              <FormGroup>
                <Label htmlFor="phoneNumber">Telefon</Label>
                <Input
                  type="text"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input type="text" id="email" {...register("email")} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="socialMedia">Social Media</Label>
                <Input
                  type="text"
                  id="socialMedia"
                  {...register("socialMedia")}
                />
              </FormGroup>
            </ContactWrapper>
          </InfoWrapper>
          <Button type="submit">Zapisz</Button>
        </LeftProfileForm>
        <RightProfileForm>
          <FormGroup>
            <Label>Zajęcia</Label>
            <CheckboxGroup>
              {classLevel[0].options.map((option) => (
                <CheckboxLabel key={option}>
                  <CheckboxInput
                    type="checkbox"
                    id={option}
                    value={option}
                    {...register("classLevel")}
                    defaultChecked={watchedClassLevel.includes(option.trim())}
                  />
                  {option}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </FormGroup>
          <FormGroup>
            <Label>Języki</Label>
            <CheckboxGroup>
              {languages[0].options.map((option) => (
                <CheckboxLabel key={option}>
                  <CheckboxInput
                    type="checkbox"
                    id={option}
                    value={option}
                    {...register("languages")}
                    defaultChecked={watchedLanguages.includes(option.trim())}
                  />
                  {option}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </FormGroup>
        </RightProfileForm>
      </EditProfileWrapper>
    </Section>
  );
};
