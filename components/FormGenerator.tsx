import { Button, Col, Row, Typography, DropDownProps } from 'antd'
import { 
  Field,
  FieldArray, 
  Formik, 
  getIn 
} from 'formik'
import { 
  Checkbox, 
  DatePicker, 
  Form, 
  FormItem, 
  Input, 
  ResetButton, 
  Select, 
  SubmitButton, 
  Switch,
  Radio,
  InputNumber
} from 'formik-antd'
import { SketchPicker } from 'react-color'
import moment from 'moment'
import dynamic from 'next/dynamic';

const Dropdown: any = dynamic(
  () => import('antd').then((mod) => mod.Dropdown),
  { ssr: false }
);

export interface FormOptionProps {
  generalOptions: {
    type: "horizontal"|"vertical"|"inline",
    innerRef?: any,
    formClassName: string,
    submit: {
      className: string,
      text: string,
    },
    reset?: {
      className: string,
      text: string,
    },
    customActionButtons?: Array<{
      className: string,
      text: string,
      action: any,
    }>
  },
  formInitialValues: any,
  formValidations: any,
  formSubmit: any,
  formInputsRows: Array<any>
}

const FormGenerator = (FormOptions: FormOptionProps) => {
  // const DummyFormOptions = {
  //   generalOptions: {
  //     type: "vertical", //horizontal, vertical, inline
  //     formClassName: "test-form",
  //     submit: {
  //       className: "primary-button-style",
  //       text: "Create User",
  //     },
  //     reset: {
  //       className: "primary-button-style",
  //       text: "Clear",
  //     },
  //     cancel: {
  //       className: "primary-button-style cancel",
  //       text: "Create User",
  //       action: () => {
  //         // useRouter().back();
  //         console.log('cancel clicked')
  //       }
  //     }
  //   },
  //   formInitialValues: {
  //     firstName: "",
  //     lastName: "",
  //     username: "",
  //     password: ""
  //   },
  //   formValidations: (values) => {
  //     const errors = {};
  //     if(!values.firstName){
  //       errors.firstName = 'First name required'
  //     }
  //     if(!values.lastName){
  //       errors.lastName = 'Last name required'
  //     }
  //     if(!values.username){
  //       errors.username = 'Login name required'
  //     }
  //     if(!values.password){
  //       errors.password = 'Password required'
  //     }else if (
  //       !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/i.test(values.password)
  //     ){
  //       errors.password = 'At least 8 characters, one uppercase and one number'
  //     }
  //     return errors;
  //   },
  //   formSubmit: (values, { setSubmitting, setFieldError }) => {
  //     setTimeout(() => {
  //       alert(JSON.stringify(values, null, 2));
  //       console.log('form submitted values',values)
  //       setSubmitting(false);
  //     }, 400);
  //   },
  //   formInputsRows: [
  //     {
  //       inputs: [
  //         {
  //           name: "firstName",
  //           label: "First Name",
  //           placeholder: "Put your first name",
  //           type: "text",
  //           required: true
  //         },
  //         {
  //           name: "lastName",
  //           label: "Last Name",
  //           placeholder: "Put your last name",
  //           type: "text",
  //           required: true
  //         },
  //         {
  //           name: "username",
  //           label: "Login Name",
  //           placeholder: "Put your login name",
  //           type: "text",
  //           required: true
  //         },
  //         {
  //           name: "password",
  //           label: "Password",
  //           placeholder: "Put your password",
  //           type: "password",
  //           tooltip: "At least 8 characters, one uppercase and one number",
  //           required: true
  //         }
  //       ]
  //     }
  //   ],
  // }
  
  const renderInputType = (input?: any, values?: any, setFieldValue?: any, resetForm?: any) => {
    switch (input.type) {
      case 'text':
        return (
          <Input
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            placeholder={input.placeholder}
            disabled={input.disabled ? input.disabled : false}
            prefix={input.prefix ? input.prefix : undefined}
            onChange={(value) => {
              setFieldValue(input.name, value.target.value);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = value.target.value;
                input.customOnChange(
                  value.target.value,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          />
        );
        break;
      case 'textArea':
        return (
          <Input.TextArea
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            placeholder={input.placeholder}
            disabled={input.disabled ? input.disabled : false}
            rows={input.rows ? input.rows : undefined}
            onChange={(value) => {
              setFieldValue(input.name, value.target.value);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = value.target.value;
                input.customOnChange(
                  value.target.value,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          />
        );
        break;
      case 'password':
        return (
          <Input.Password
            name={input.listName ? input.listName : input.name}
            placeholder={input.placeholder}
            onChange={
              input.customOnChange
                ? (value) => {
                    input.customOnChange(
                      value.target.value,
                      FormOptions.formInputsRows,
                      setFieldValue,
                      resetForm,
                      values
                    );
                  }
                : undefined
            }
          />
        );
        break;
      case 'select':
        return (
          <Select
            name={input.listName ? input.listName : input.name}
            placeholder={input.placeholder}
            className={input.className ? input.className : ''}
            showSearch={input.showSearch? input.showSearch: false}
            onChange={
              input.customOnChange
                ? (val) => {
                  let resultValues = values;
                  resultValues[input.name] = val;
                    input.customOnChange(
                      val,
                      FormOptions.formInputsRows,
                      setFieldValue,
                      resetForm,
                      values
                    );
                  }
                : undefined
            }
          >
            {input.options.map((item: any, index: any) => {
              return (
                <Select.Option key={index+item.optionValue+item.optionLabel} value={item.optionValue}>
                  {item.optionLabel}
                </Select.Option>
              );
            })}
          </Select>
        );
        break;
      case 'switch':
        return (
          <Switch
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            checkedChildren={input.checkedChildren}
            unCheckedChildren={input.unCheckedChildren}
            defaultChecked={input.defaultChecked}
            onChange={(value) => {
              setFieldValue(input.name, value);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = value;
                input.customOnChange(
                  value,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          />
        );
        break;
      case 'datePicker':
        return (
          <DatePicker 
            name={input.listName ? input.listName : input.name} 
            defaultValue={input.defaultValue? moment(input.defaultValue,(input.format?input.format:"YYYY-MM-DD")): undefined}
            format={input.format? input.format : "YYYY-MM-DD"}
            onChange={(date, dateString) => {
              setFieldValue(input.name, dateString);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = dateString;
                input.customOnChange(
                  dateString,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          />
        );
        break;
      case 'checkBox':
        return (
          <Checkbox
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            defaultChecked={input.defaultChecked}
            onChange={(value) => {
              setFieldValue(input.name, value.target.checked);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = value.target.checked;
                input.customOnChange(
                  value.target.checked,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          >
            {input.text}
          </Checkbox>
        );
        break;
      case 'checkBoxGroup':
        return (
          <Checkbox.Group
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            options={input.options}
            defaultValue={input.defaultValue}
            onChange={(value) => {
              setFieldValue(input.name, value);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = value;
                input.customOnChange(
                  value,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          />
        );
        break;
      case 'radio':
        return(
          <Radio.Group
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            options={input.options ? input.options : []}
            defaultValue={input.defaultValue ? input.defaultValue : ''}
            optionType={input.optionType ? input.optionType : ''}
            buttonStyle={input.buttonStyle ? input.buttonStyle : ''}
            onChange={(value) => {
              setFieldValue(input.name, value.target.value);
              if (input.customOnChange !== undefined) {
                let resultValues = values;
                resultValues[input.name] = value.target.value;
                input.customOnChange(
                  value.target.value,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  resultValues
                );
              }
            }}
          />
        );
      case 'list':
        let listArrayLength = values[input.name]
          ? values[input.name].length
          : 0;
        return (
          <FieldArray
            key={input.name}
            name={input.name}
            render={(arrayHelpers: {
              remove: (arg0: any) => void;
              form: { errors: { [x: string]: any } };
              push: (arg0: {}) => void;
            }) => (
              <Col span={24}>
                <h2 className='separator-title'>
                  {input.label}{' '}
                  {input.addMax ? '(max. Inputs: ' + input.addMax + ')' : ''}
                </h2>
                {values[input.name] && values[input.name].length > 0
                  ? values[input.name].map((_listItem: any, index: any) => {
                      return (
                        <Row key={index+_listItem.name}>
                          {input.listFields.map((field: any, idx: any) => {
                            const newFieldName =
                              input.name + '[' + index + '].' + field.name;
                            field.listName = newFieldName;
                            return (
                              <Col flex='auto' key={idx}>
                                <FormItem
                                  name={newFieldName}
                                  label={field.label}
                                  tooltip={field.tooltip}
                                  valuePropName={
                                    field.type === 'switch' ||
                                    field.type === 'checkBox' ||
                                    field.type === 'checkBoxGroup'
                                      ? 'checked'
                                      : undefined
                                  }
                                >
                                  {renderInputType(field)}
                                </FormItem>
                              </Col>
                            );
                          })}
                          <Col flex='auto' className='list-actions'>
                            <FormItem name='action' label='Actions'>
                              {input.customActions &&
                                input.customActions.map(
                                  (action: any, i: any) => {
                                    return (
                                      <Button
                                        key={i}
                                        type='dashed'
                                        className='custom-added'
                                        onClick={() => {
                                          action.onClick(
                                            values[input.name][index]
                                          );
                                        }}
                                      >
                                        {action.label}
                                      </Button>
                                    );
                                  }
                                )}
                              <Button
                                type='dashed'
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                            </FormItem>
                          </Col>
                        </Row>
                      );
                    })
                  : ''}
                <Col flex='auto'>
                  {arrayHelpers.form.errors[input.name] &&
                    typeof arrayHelpers.form.errors[input.name] === 'string' &&
                    getIn(arrayHelpers.form.errors, input.name) && (
                      <div>
                        <Typography.Text type='danger'>
                          {getIn(arrayHelpers.form.errors, input.name)}
                        </Typography.Text>
                      </div>
                    )}
                  <Button
                    type='dashed'
                    disabled={
                      input.addMax
                        ? listArrayLength < input.addMax
                          ? false
                          : true
                        : false
                    }
                    onClick={() => {
                      if (input.addMax) {
                        if (listArrayLength < input.addMax) {
                          let addObject: any = {};
                          input.listFields.map((field: any) => {
                            addObject[field.name] = '';
                          });
                          arrayHelpers.push(addObject);
                        }
                      } else {
                        let addObject: any = {};
                        input.listFields.map((field: any) => {
                          addObject[field.name] = '';
                        });
                        arrayHelpers.push(addObject);
                      }
                    }}
                  >
                    Add
                  </Button>
                </Col>
              </Col>
            )}
          />
        );
        break;
      case 'number':
        return(
          <InputNumber
            name={input.listName ? input.listName : input.name}
            className={input.className ? input.className : ''}
            formatter={input.formatter ? input.formatter : ''}
            parser={input.parser ? input.parser : ''}
            min={input.min ? input.min : null}
            max={input.max ? input.max : null}
          />
        )
      case 'color':
        let backgroundColor= values[input.name].hex? values[input.name].hex: "";
        return (
          <Dropdown 
            overlay={
              <SketchPicker
                color={values[input.name]?.rgb}
                presetColors={[]}
                onChange={(color)=>{
                  setFieldValue(input.name,color)
                  backgroundColor = color;
                  if (input.customOnChange !== undefined) {
                    let resultValues = values;
                    resultValues[input.name] = color;
                    input.customOnChange(
                      color,
                      FormOptions.formInputsRows,
                      setFieldValue,
                      resetForm,
                      resultValues
                    );
                  }
                }}
              />
            } 
            placement="bottomLeft"
            trigger={['click']}
          >
            <Button className={"colorpicker-input-btn"} style={{background: backgroundColor }}>
              {input.name}
            </Button>
          </Dropdown>
        )
      case 'btnAction':
        return(
          <Button
            onClick={()=>{
              if (input.action !== undefined) {
                input.action(
                  values,
                  FormOptions.formInputsRows,
                  setFieldValue,
                  resetForm,
                  values
                );
              }
            }}
          >
            {input.text}
          </Button>
        )
      default:
        break;
    }
  };

  return (
    <Formik
      innerRef={FormOptions.generalOptions.innerRef?FormOptions.generalOptions.innerRef:undefined}
      initialValues={FormOptions.formInitialValues}
      validate={FormOptions.formValidations}
      onSubmit={FormOptions.formSubmit}
    >
      {({ values, isSubmitting, setFieldValue, resetForm }: any) => (
        <Form
          layout={FormOptions.generalOptions.type}
          className={'formik-form ' + FormOptions.generalOptions.formClassName}
        >
          {FormOptions.formInputsRows.map((row: any, index: any) => {
            if(row.showIf){
              if(row.showIf.multiple){
                let returnEmpty = true
                row.showIf.conditions.map((condition)=>{
                  if(condition.condition){
                    if(condition.condition === 'notEqual'){
                      if (values[condition.input] && values[condition.input] !== condition.value) {
                        returnEmpty = false;
                      }
                    }
                  }else if (values[condition.input] === condition.value) {
                    returnEmpty = false;
                  }
                })
                if (returnEmpty){
                  return;
                }
              }else if (values[row.showIf.input] !== row.showIf.value) {
                return;
              }
            }
            const content = row.inputs.map((input: any, idx: any) => {
              if (input.type === 'list') {
                return renderInputType(input, values, setFieldValue, resetForm);
              }
              if (input.showIf) {
                if(input.showIf.multiple){
                  let returnEmpty = true
                  input.showIf.conditions.map((condition)=>{
                    if(condition.condition){
                      if(condition.condition === 'notEqual'){
                        if (values[condition.input] && values[condition.input] !== condition.value) {
                          returnEmpty = false;
                        }
                      }
                    }else if (values[condition.input] === condition.value) {
                      returnEmpty = false;
                    }
                  })
                  if (returnEmpty){
                    return;
                  }
                }else if(input.showIf.condition){
                  if(input.showIf.condition === 'notEqual'){
                    if (!values[input.showIf.input] || values[input.showIf.input] === input.showIf.value) {
                      return;
                    }
                  }
                }else if (values[input.showIf.input] !== input.showIf.value) {
                  return;
                }
              }
              if (input.isSeparator) {
                return(
                  <Col span={24} key={index+input.name}>
                    {input.separatorTitle && (
                      <h2>{input.separatorTitle}</h2>
                    )}
                  </Col>
                )
              }
              return (
                <Col
                  key={idx+input.name}
                  flex={input.responsive ? undefined : 'auto'}
                  xs={input.responsive ? input.responsive.xs : undefined}
                  sm={input.responsive ? input.responsive.sm : undefined}
                  md={input.responsive ? input.responsive.md : undefined}
                  lg={input.responsive ? input.responsive.lg : undefined}
                >
                  <FormItem
                    name={input.name}
                    label={input.label}
                    tooltip={input.tooltip}
                    valuePropName={
                      input.type === 'switch' ||
                      input.type === 'checkBox' ||
                      input.type === 'checkBoxGroup'
                        ? 'checked'
                        : undefined
                    }
                  >
                    {renderInputType(input, values, setFieldValue, resetForm)}
                  </FormItem>
                </Col>
              );
            });
            if (row.innerBlock) {
              return (
                <Row
                  key={index}
                  gutter={[16, 16]}
                  className={row.className ? row.className : ''}
                >
                  {row.separatorTitle && (
                    <Col span={12}>
                      <h2 className='separator-title'>{row.separatorTitle}</h2>
                    </Col>
                  )}
                  <Col span={12} className='custom-inner-block'>
                    <Row
                      className={
                        row.innerRowClassName ? row.innerRowClassName : ''
                      }
                    >
                      {content}
                    </Row>
                  </Col>
                </Row>
              );
            }
            return (
              <Row
                key={index+row}
                className={row.className ? row.className : ''}
              >
                {row.separatorTitle && (
                  <Col xs={24}>
                    <h2 className='separator-title'>{row.separatorTitle}</h2>
                  </Col>
                )}
                {content}
              </Row>
            );
          })}
          <div className='actions-section'>
            <SubmitButton
              className={FormOptions.generalOptions.submit.className}
              disabled={isSubmitting}
            >
              {FormOptions.generalOptions.submit.text}
            </SubmitButton>
            {FormOptions.generalOptions.customActionButtons && (
              FormOptions.generalOptions.customActionButtons.map((btn,indx)=>{
                return(
                  <Button
                    className={btn.className}
                    onClick={btn.action}
                    key={indx+btn.text}
                  >
                    {btn.text}
                  </Button>
                )
              })
            )}
            {FormOptions.generalOptions.reset && (
              <ResetButton
                className={FormOptions.generalOptions.reset.className}
              >
                {FormOptions.generalOptions.reset.text}
              </ResetButton>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

// FormGenerator.propTypes = {
  // someData: PropTypes.string,
// };

export default FormGenerator;