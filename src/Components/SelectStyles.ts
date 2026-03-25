export const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: state.isFocused ? '#f2ca50' : 'rgba(229, 226, 225, 0.2)',
    borderWidth: '0 0 2px 0',
    borderRadius: '0',
    boxShadow: 'none',
    padding: '8px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#f2ca50'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#131313',
    border: '1px solid rgba(229,226,225,0.1)',
    borderRadius: '12px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.7)',
    overflow: 'hidden',
    zIndex: 50,
    marginTop: '4px'
  }),
  menuList: (base: any) => ({
    ...base,
    padding: '4px'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#f2ca50' : state.isFocused ? 'rgba(255,255,255,0.05)' : 'transparent',
    color: state.isSelected ? '#131313' : '#e5e2e1',
    cursor: 'pointer',
    borderRadius: '8px',
    margin: '2px 0',
    fontWeight: state.isSelected ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
    '&:active': {
      backgroundColor: '#f2ca50',
      color: '#131313'
    }
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#f2ca50',
    fontFamily: '"Manrope", sans-serif',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'rgba(229, 226, 225, 0.3)',
    fontFamily: '"Manrope", sans-serif',
    letterSpacing: '0.05em'
  }),
  input: (base: any) => ({
    ...base,
    color: '#e5e2e1',
    fontFamily: '"Manrope", sans-serif'
  }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? '#f2ca50' : 'rgba(229, 226, 225, 0.3)',
    padding: '0 8px',
    '&:hover': {
      color: '#f2ca50'
    }
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '0 8px'
  })
};
