import './addresses.css';
import { AddressForm } from '@shopify/theme-addresses';

export default (element) => {
  const primaryAction = element.querySelector('[data-primary-action="add"]');
  const primaryActionCancel = element.querySelector(
    '[data-primary-action="cancel"]',
  );

  const addCancelButton = element.querySelector('#AddAddressCancel');
  const addAddressContainer = element.querySelector('#AddAddress');
  const editButtonsList = element.querySelectorAll('[id*="EditFormButton_"]');
  const editCancelButtonsList = element.querySelectorAll(
    '[id*="EditAddressCancel_"]',
  );
  const addressesElement = element.querySelector('#AddressesList');
  const deleteAddressButtonList = element.querySelectorAll(
    '[data-confirm-message]',
  );

  const addresses = element.querySelectorAll('[data-address-fields]');

  const init = () => {
    addresses.forEach((address) => {
      AddressForm(address, 'en').then(() => {
        triggerDefaultValues('[data-address-country][data-default]');
        triggerDefaultValues('[data-address-province][data-default]');
      });
    });
    bindEventListeners();
  };

  const bindEventListeners = () => {
    primaryAction.addEventListener('click', handleAddNewAddress);
    addCancelButton.addEventListener('click', handleCancelNewAddress);

    editButtonsList.forEach((editButton) => {
      editButton.addEventListener('click', handleEditAddress);
    });

    editCancelButtonsList.forEach((cancelButton) => {
      cancelButton.addEventListener('click', handleCancelEditAddress);
    });

    deleteAddressButtonList.forEach((deleteAddressButton) => {
      deleteAddressButton.addEventListener('click', handleDeleteAddress);
    });

    // countrySelects.forEach((countrySelect) =>
    //   countrySelect.addEventListener('change', handleUpdateCountry),
    // );
  };

  const triggerDefaultValues = (domElem) => {
    const elements = document.querySelectorAll(domElem);
    [...elements].forEach((elementSingle) => {
      const value = elementSingle.getAttribute('data-default');
      [...elementSingle.options].forEach((option) => {
        if (option.text === value) {
          // eslint-disable-next-line no-param-reassign
          elementSingle.value = option.value;
          elementSingle.dispatchEvent(new Event('change'));
        }
      });
    });
  };

  const postLink = (path, options = {}) => {
    const method = options.method || 'post';
    const params = options.parameters || {};

    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in params) {
      const hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', params[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handleDeleteAddress = ({ currentTarget }) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm(currentTarget.getAttribute('data-confirm-message'))) {
      postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  };

  const handleAddNewAddress = () => {
    primaryAction.classList.add('hidden');
    primaryActionCancel.classList.remove('hidden');

    primaryActionCancel.addEventListener('click', handleCancelNewAddress);

    addAddressContainer.classList.remove('hidden');
    addressesElement.classList.add('hidden');
  };

  const handleCancelNewAddress = () => {
    primaryAction.classList.remove('hidden');
    primaryActionCancel.classList.add('hidden');

    primaryActionCancel.removeEventListener('click', handleCancelNewAddress);

    addAddressContainer.classList.add('hidden');
    addressesElement.classList.remove('hidden');
  };

  const handleEditAddress = ({ currentTarget }) => {
    const { addressId } = JSON.parse(JSON.stringify(currentTarget.dataset));

    primaryAction.classList.add('hidden');
    primaryActionCancel.classList.remove('hidden');

    primaryActionCancel.dataset.addressId = addressId;
    primaryActionCancel.addEventListener('click', handleCancelEditAddress);

    const editAddressForm = element.querySelector(`#EditAddress_${addressId}`);
    editAddressForm.classList.remove('hidden');
    addressesElement.classList.add('hidden');
  };

  const handleCancelEditAddress = ({ currentTarget }) => {
    const addressId = currentTarget?.dataset?.addressId;

    primaryAction.classList.remove('hidden');
    primaryActionCancel.classList.add('hidden');

    primaryActionCancel.removeAttribute('data-address-id');
    primaryActionCancel.removeEventListener('click', handleCancelEditAddress);

    const editAddressForm = element.querySelector(`#EditAddress_${addressId}`);
    editAddressForm.classList.add('hidden');
    addressesElement.classList.remove('hidden');
  };

  init();
};
