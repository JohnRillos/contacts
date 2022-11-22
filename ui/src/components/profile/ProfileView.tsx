import React, { useState } from 'react';
import { useContext } from 'react';
import { editSelf } from '../../api/WhomPokes';
import { AppContext } from '../../context/AppContext';
import { InfoValue, InfoDate } from '../../types/ContactTypes';
import { AccessLevel, SelfField } from '../../types/ProfileTypes';
import BackButton from '../buttons/BackButton';
import SubmitButton from '../buttons/SubmitButton';
import DateInput from '../input/DateInput';
import TextInput from '../input/TextInput';
import isEqual from 'lodash.isequal';
import SelectInput from '../input/SelectInput';

export default function ProfileView(props: { closeContainer: () => void }): JSX.Element {
  const { api, displayError, fieldSettings, self } = useContext(AppContext);
  let [submitting, setSubmitting] = useState<boolean>(false);
  let [infoFields, setInfoFields] = useState<Record<string, SelfField | null>>(self.info);

  function submitChanges() {
    setSubmitting(true);
    editSelf(
      api,
      sanitizeInfo(infoFields),
      onError,
      () => {
        setSubmitting(false);
      }
    );
  }

  function onError(error: string | null) {
    setSubmitting(false);
    displayError(error || 'Error editing profile!');
  }

  function sanitizeInfo(info: Record<string, SelfField | null>): Record<string, SelfField | null> {
    return Object.fromEntries(
      Object.entries(info)
      .filter(([key, val]) => {
        if (!val && !(key in self.info)) {
          return false;
        }
        return !isEqual(self.info[key], val);
      })
    );
  }

  function onInfoTextChange(key: string): (arg: string) => void {
    return (value: string) => {
      if (!value) {
        setInfoFields({
          ...infoFields,
          [key]: null
        });
        return;
      }
      var before = infoFields[key];
      var after = {
        value: value,
        access: before ? before.access : 'public'
      };
      setInfoFields({
        ...infoFields,
        [key]: after
      });
    }
  }

  function onInfoDateChange(key: string): (arg: InfoDate | undefined) => void {
    return (value: InfoDate | undefined) => {
      if (!value) {
        setInfoFields({
          ...infoFields,
          [key]: null
        });
        return;
      }
      var before = infoFields[key];
      var after = {
        value: value,
        access: before ? before.access : 'public'
      };
      setInfoFields({
        ...infoFields,
        [key]: after
      });
    }
  }

  function onAccessChange(key: string): (arg: string) => void {
    return (access: string) => {
      var before = infoFields[key];
      if (!before) {
        return;
      }
      setInfoFields({
        ...infoFields,
        [key]: {
          value: before.value,
          access: access as AccessLevel
        }
      });
    }
  }

  function renderInfoValue(key: string, val: InfoValue | undefined) {
    const label = fieldSettings.defs[key]?.name || key;
    switch (fieldSettings.defs[key]?.type) {
      case 'text':
        return <TextInput label={label} value={val as string | undefined} onChange={onInfoTextChange(key)}/>;
      case 'date':
        return <DateInput label={label} value={val as InfoDate | undefined} onChange={onInfoDateChange(key)}/>;
      default:
        return <span>error</span>;
    }
  }

  function renderSelfField(key: string, field: SelfField | null | undefined) {
    return (
      <div className='flex flex-row space-x-2'>
        <div className='mr-auto'>
          {renderInfoValue(key, field?.value)}
        </div>
          {renderAccessLevel(key, field?.access)}
      </div>
    );
  }

  function renderAccessLevel(key: string, access: AccessLevel | undefined) {
    return (
      <SelectInput label={''}
        value={access}
        options={[
          {value: 'public', display: 'Public'},
          {value: 'mutual', display: 'Pals' }]}
        onChange={onAccessChange(key)}
        disabled={!infoFields[key]}
      />
    );
  }

  function renderSelfFields() {
    return (
      <ul>
        {fieldSettings.order.map((key: string) => {
          return <li key={key}>
            {renderSelfField(key, hasEdits ? infoFields[key] : self.info[key])}
          </li>
        })}
      </ul>
    );
  }

  const hasEdits: boolean = Object.keys(sanitizeInfo(infoFields)).length > 0;
  const canSubmit: boolean = !submitting && hasEdits;

  function resetChanges() {
    setInfoFields(self.info);
  }

  function renderProfile() {
    return (
      <div className='text-left h-fit'>
        <p className='text-center text-sm mb-1'>
          Anyone can see the public fields on your profile. <br/>
          Only your mutual pals can see fields marked "Pals".
        </p>
        <h2 className='text-center mb-2 font-bold text-2xl'>~{window.ship}</h2>
        {renderSelfFields()}
        <div className='mt-2 space-x-2'>
          <SubmitButton
            className='font-bold'
            onClick={submitChanges}
            disabled={!canSubmit}
          >
            Publish
          </SubmitButton>
          {canSubmit ?
            <button
              type='button'
              className='px-1 py-0.5 rounded-md button-secondary font-bold hover:bg-neutral-500/20'
              onClick={resetChanges}
            >
              Cancel
            </button> : null
          }
        </div>
      </div>
    );
  }

  return (
    <div className='h-full w-full flex flex-col'>
      <nav className='flex-shrink w-full flex flex-row p-4'>
        <div className='fixed'>
          <BackButton label='Contacts' onClick={props.closeContainer}/>
        </div>
        <h1 className='m-auto text-center text-3xl font-bold'>Profile</h1>
      </nav>
      <div className='mx-auto justify-self-center max-w-md px-4 pb-4 overflow-y-auto'>
        {renderProfile()}
      </div>
    </div>
  );
};
