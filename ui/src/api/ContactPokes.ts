import Urbit from "@urbit/http-api";
import { Contact, InfoValue } from "../types/ContactTypes";
import { WhomAction } from "../types/GallTypes";
import { FieldDef } from "../types/SettingTypes";

function poke(api: Urbit, action: WhomAction, onError: (err: string | undefined) => void) {
  api.poke({
    app: 'whom',
    mark: 'whom-action',
    json: action,
    onSuccess: () => { console.log('Success!') },
    onError: (err: string | undefined) => onError(err?.match(/".*\"/)?.[0])
  });
}

export function createContact(api: Urbit, contact: Contact, onError: (err: string | undefined) => void) {
  poke(api, { 'add-contact': { contact } }, onError);
}

export function editContact(
    api: Urbit,
    key: string,
    info: Record<string, InfoValue | null>,
    onError: (err: string | undefined) => void
  ) {
  const json = {
    'edit-contact': {
      key,
      info
    }
  };
  poke(api, json, onError);
}

export function deleteContact(api: Urbit, contactKey: string, onError: (err: string | undefined) => void) {
  poke(api, { 'del-contact': { key: contactKey, } }, onError);
}

export function addCustomField(api: Urbit, fieldDef: FieldDef, onError: (err: string | undefined) => void) {
  poke(api, { 'add-custom-field': {
    key: fieldDef.key,
    def: {
      name: fieldDef.name,
      type: fieldDef.type,
      custom: true
    }
  }}, onError);
}
