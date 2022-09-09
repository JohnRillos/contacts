|%
+$  contact
  $:  ship=(unit @p)
      info=(map @tas info-field)
  ==
::
+$  action
  $%  [%add-contact =contact]
      [%del-contact key=(each @p @t)]
      [%edit-contact key=(each @p @t) info=(map @tas (unit info-field))]
      [%add-custom-field key=@tas def=field-def]
  ==
::
+$  update  contacts=contacts-0
::
+$  field-def  [name=@t type=field-type-tag custom=?]
::
+$  field-type-tag  ?(%text %date)
::
+$  info-field
  $%  @t
      info-date
  ==
::
+$  info-date
  $:  %date
      year=@ud
      month=@ud
      day=@ud
  ==
::
+$  contacts-0  (map (each @p @t) contact)
::
+$  fields-0  (list [@tas field-def])
--
