import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchConfig } from "../../../hooks/useSearchConfig";
import {
  SearchWrapper,
  FieldContainer,
  StyledSelect,
  DateInput,
  SubmitButton,
  InputLabel,
  StyledOption,
} from "./SearchForm.styled";

const SearchForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { searchConfig } = useSearchConfig();

  const renderField = (field) => {
    if (field.type === "date-picker") {
      return (
        <DateInput key={field.name}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Wybierz datę"
            locale="pl"
          />
        </DateInput>
      );
    }
    if (field.type === "select") {
      return (
        <FieldContainer key={field.name}>
          <StyledSelect
            value={field.name === "activity" ? selectedActivity : selectedCity}
            onChange={(e) =>
              field.name === "activity"
                ? setSelectedActivity(e.target.value)
                : setSelectedCity(e.target.value)
            }
          >
            <StyledOption value="">{field.label}</StyledOption>
            {field.options.map((option, index) => (
              <StyledOption key={index} value={option}>
                {option}
              </StyledOption>
            ))}
          </StyledSelect>
        </FieldContainer>
      );
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const searchData = {
      activity: selectedActivity,
      city: selectedCity,
      date: selectedDate,
    };

    console.log("Wyszukiwanie z danymi:", searchData);
  };

  return (
    <SearchWrapper onSubmit={handleSubmit}>
      {searchConfig.map((field) => renderField(field))}
      <button type="submit">Szukaj</button>
    </SearchWrapper>
  );
};

export default SearchForm;
