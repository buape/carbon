# Modal Breaking Changes Guide

This guide outlines the breaking changes to Carbon's modal implementation following Discord's API deprecation of Row-based modals.

## Breaking Changes Overview

1. **Row-based Modals Removed**: `Modal.components` now only accepts `Label[]`
2. **TextInput Label Removed**: `label` field removed from TextInput - handled by parent Label
3. **New Label Component**: All modal inputs must be wrapped in Label components
4. **New ModalStringSelectMenu**: String selects in modals use dedicated class with `required` field

## Migration Required

### ❌ Old Structure (No Longer Supported)
```typescript
import { Modal, Row, TextInput, TextInputStyle } from "@buape/carbon"

class OldModal extends Modal {
	title = "Old Modal"
	customId = "old-modal"
	
	// ❌ This will cause TypeScript errors
	components = [
		new Row([new NameTextInput()]),
		new Row([new AgeTextInput()])
	]
}

class NameTextInput extends TextInput {
	customId = "name"
	label = "What is your name?" // ❌ Property removed
	style = TextInputStyle.Short
}
```

### ✅ New Structure (Required)
```typescript
import { Modal, Label, TextInput, ModalStringSelectMenu, TextInputStyle } from "@buape/carbon"

class NewModal extends Modal {
	title = "New Modal" 
	customId = "new-modal"
	
	components = [
		new PersonalInfoLabel(),
		new PreferencesLabel()
	]
}

class PersonalInfoLabel extends Label {
	customId = "personal-info"
	label = "Personal Information"
	description = "Tell us about yourself"
	
	components = [
		new NameTextInput(),
		new AgeTextInput()
	]
}

class PreferencesLabel extends Label {
	customId = "preferences" 
	label = "Preferences"
	
	components = [
		new FavoriteColorSelect()
	]
}

class NameTextInput extends TextInput {
	customId = "name"
	style = TextInputStyle.Short
	placeholder = "Enter your name"
}

class FavoriteColorSelect extends ModalStringSelectMenu {
	customId = "color"
	placeholder = "Choose your favorite color"
	required = true
	options = [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" }
	]
}
```

## Benefits of New Structure

1. **Better Organization**: Group related inputs under descriptive labels
2. **Improved UX**: Labels with descriptions provide better context  
3. **Select Menus**: Support for dropdowns in modals
4. **API Compliance**: Follows Discord's new modal requirements

## Migration Steps

1. **Remove Row imports**: Remove `Row` from imports, add `Label`
2. **Wrap inputs in Labels**: Create Label classes to contain your TextInputs
3. **Remove TextInput labels**: Delete `label` field from TextInput classes
4. **Add placeholders**: Use `placeholder` field on TextInputs for user guidance  
5. **Use ModalStringSelectMenu**: Replace StringSelectMenu with ModalStringSelectMenu for modals
6. **Update Modal components**: Change `components` array to contain Labels instead of Rows

## Quick Migration Checklist

- [ ] Replace `Row` with `Label` components
- [ ] Move labels from TextInput to Label component
- [ ] Remove `label` field from all TextInput classes  
- [ ] Add `placeholder` fields to TextInputs
- [ ] Use `ModalStringSelectMenu` for select menus
- [ ] Update Modal `components` array type
- [ ] Test modal functionality