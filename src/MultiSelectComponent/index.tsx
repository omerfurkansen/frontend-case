/**
  @author Omer Furkan Sen
  @date 12.10.2023
  @brief MultiSelect Component
  @details This component is a multi select component that fetches data from an API and shows it to the user with a search bar.
    User can select multiple options and click the search button to see the selected options.
    The selected options are stored in local storage and when the user refreshes the page, the selected options are shown on top of the list.
    The selected options are also shown on top of the list when the user selects a new option.
    The component has a skeleton loading state and a no result state.
*/

import React, { useState, useEffect } from 'react';
import { TEXT, ENDPOINT, CONSTANT } from './config';
import { getUniqueArray, getProperString, delay } from './helpers';
import { Kategori, IKategoriResponse } from './types/MultiSelect.types';
import './styles/MultiSelect.css';

const MultiSelect: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<Kategori[]>([]);
  const [options, setOptions] = useState<Kategori[]>([]);

  useEffect(() => {
    if (isSelectedSetToTop()) {
      return;
    }
    receiveApiData();
  }, [selected]);

  const receiveApiData = async () => {
    if (!isLoading) {
      setSelected([]);
      setOptions([]);
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(ENDPOINT.Kategori);
      const json: IKategoriResponse = await response.json();
      // I created below delay to simulate a real API call, 3 seconds, you can change it to 0
      await delay(3000);

      setIsLoading(false);

      const data = getUniqueArray(json.data.map((item: string) => getProperString(item)));
      if (selected.length === 0) {
        setOptions(data);
      }
    
      const storedSelected = localStorage.getItem('selected');
      if (storedSelected && selected.length === 0) {
        setSelected(JSON.parse(storedSelected));
      }
    } catch (error) {
      console.error(`${TEXT.KategoriFetchError}: ${error}`);
    }
  }

  const isSelectedSetToTop = () => {
    if (options.length > 0) {
      if (selected.length > 0) {
        const selectedOptions = options.filter(option => selected.includes(option));
        const unselectedOptions = options.filter(option => !selected.includes(option));
        setOptions([...selectedOptions, ...unselectedOptions]);
      }
      return true;
    }
    return false;
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const handleSearchClick = () => {
    if (isLoading) {
      return;
    }

    localStorage.setItem('selected', JSON.stringify(selected));
    receiveApiData();
  }

  const handleOptionClick = (option: Kategori) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(item => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  }

  const filterFunction = (option: Kategori) => {
    if (selected.includes(option)) {
      return true;
    } else {
      return option.toLowerCase().includes(search.toLowerCase());
    }
  }

  const showSkeleton = (options.length === 0 && isLoading);
  const showNoResult = (options.filter(option => option.toLowerCase().includes(search.toLowerCase())).length === 0 && !isLoading);
  const showOptions = (options.length > 0 && !isLoading);

  const renderSkeleton = Array.from(new Array(CONSTANT.SkeletonAmount)).map((_, index) => (
    <div key={index} className="MultiSelect__option skeleton" />
  ))

  const renderOptions = (
    options
      .filter(option => filterFunction(option))
      .map(option => (
        <div
          key={option}
          className="MultiSelect__option"
          onClick={() => handleOptionClick(option)}
        >
          <button className={selected.includes(option) ? 'selected' : ''}>
            {selected.includes(option) && <div className="MultiSelect__option__square"/>}
          </button>
          <div 
            className="MultiSelect__option-label" 
            style={{ color: selected.includes(option) ? '#0056b3' : 'black' }}
          >
            {option}
          </div>
        </div>
      ))
  )

  const renderNoResult = (
    <div className="MultiSelect__option">
      {TEXT.KategoriNoResult}
    </div>
  )
  
  return (
    <div className="MultiSelect">
      <div className='MultiSelect__title'>{TEXT.KategoriTitle}</div>
      <div className="MultiSelect__search">
        <input
          type="text"
          value={search}
          placeholder={TEXT.KategoriSearchPlaceholder}
          onChange={handleSearchChange}
        />
        <img
          src="/assets/search.svg"
          alt="search"
        />
      </div>
      <div className="MultiSelect__options">
        {showSkeleton && renderSkeleton}
        {showOptions && renderOptions}
        {showNoResult && renderNoResult}
      </div>
      <button
        className='MultiSelect__search-button'
        onClick={handleSearchClick}
      >
        {isLoading ? 
          <img 
            src="/assets/spinner.svg"
            alt="spinner"
          />
        : TEXT.KategoriButton}
      </button>
    </div>
  );
}

export default MultiSelect;
