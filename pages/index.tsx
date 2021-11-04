import React, { useState, useEffect } from 'react'
import { Layout, Button, message } from 'antd'
import { BulbOutlined, CloudOutlined, ArrowUpOutlined, AimOutlined } from '@ant-design/icons'
import FormGenerator, { FormOptionProps } from '@/components/FormGenerator'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

const { Sider } = Layout;
import dynamic from 'next/dynamic';

const Content: any = dynamic(
  () => import('antd').then((mod) => mod.Layout.Content),
  { ssr: false }
);

const hexToRgba = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return {
        r: (c>>16)&255,
        g: (c>>8)&255,
        b: c&255,
        a: 1
      }
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
  }
  throw new Error('Bad Hex');
}
const randomColor = () => {
  let color: any = {};
  color.hex = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  color.rgb = hexToRgba(color.hex)
  return color;
};
const templateDirection = (style,value) => {
  if(style === 'Radial'){
    switch (value) {
      case 1:
        return "left top,";
        break;
      case 2:
        return "center top,";
        break;
      case 3:
        return "right top,";
        break;
      case 4:
        return "left center,";
        break;
      case 5:
        return "at center center,";
        break;
      case 6:
        return "right center,";
        break;
      case 7:
        return "left bottom,";
        break;
      case 8:
        return "center bottom,";
        break;
      case 9:
        return "right bottom,";
        break;
      default:
        break;
    }
  }else if (style === 'Linear'){
    switch (value) {
      case 1:
        return "to right bottom,";
        break;
      case 2:
        return "";
        break;
      case 3:
        return "to left bottom,";
        break;
      case 4:
        return "to right,";
        break;
      case 5:
        return "";
        break;
      case 6:
        return "to left,";
        break;
      case 7:
        return "to right top,";
        break;
      case 8:
        return "to top,";
        break;
      case 9:
        return "to left top,";
        break;
      default:
        break;
    }
  }
}
const colorOutput = ( color, format ) => {
  if(format === 'HEX'){
    return color.hex
  }else if(format === 'RGBA'){
    return "rgba("+ color.rgb.r + "," + color.rgb.g + "," + color.rgb.b + "," + color.rgb.a + ")" 
  }
}
const cssOutput = ( formValues ) => {
  let result = "";
  if(formValues.style === 'Linear'){
    result += 'linear-gradient('
  }else{
    if(formValues.direction === 5){
      result += 'radial-gradient('
    }else{
      result += '-webkit-radial-gradient('
    }
  }
  result += templateDirection(formValues.style,formValues.direction)
  result += colorOutput(formValues.color1,formValues.colorFormat) + ","
  result += colorOutput(formValues.color2,formValues.colorFormat) + ")"
  return result;
}

export default function Home() {
  const [ siderTheme, setSiderTheme ] = useState<"light"|"dark">('light')
  const [ templatesFull, setTemplatesFull ] = useState<any>([])
  const [ templatesToShow, setTemplatesToShow ] = useState<any>([])
  const [ formValues, setFormValues ] = useState<any>({
    style: "Linear",
    direction: 1,
    color1: randomColor(),
    color2: randomColor(),
    name: "",
    author: "",
    template: "",
    colorFormat: "HEX"
  })

  const { data: templates } = useSWR('/api/template',fetcher)
  
  useEffect(()=>{
    setTemplatesFull(templates);
    const templatesArrayToShow = (templates||[]).map((template)=>{
      return {
        optionLabel: template.name + " | " + template.author,
        optionValue: template.id
      }
    })
    setTemplatesToShow(templatesArrayToShow)
  },[templates])
  
  const changeSiderTheme = () => {
    siderTheme == 'light'? setSiderTheme('dark'):setSiderTheme('light')
  }
  const CssGradientFormOptions: FormOptionProps = {
      generalOptions: {
        type: "vertical", //horizontal, vertical, inline
        formClassName: "css-gradient-form",
        submit: {
          className: "primary-button-style",
          text: "Save Template",
        },
        // reset: {
        //   className: "primary-button-style",
        //   text: "Clear",
        // },
        customActionButtons: [
          // {
          //   className: "primary-button-style cancel",
          //   text: "Create User",
          //   action: () => {
          //     // useRouter().back();
          //     console.log('cancel clicked')
          //   }
          // }
        ],
      },
      formInitialValues: formValues,
      formValidations: (values) => {
        const errors: any = {};
        if(!values.name){
          errors.name = "Template name required"
        }
        if(!values.author){
          errors.author = "Author name required"
        }
        return errors;
      },
      formSubmit: (values, { setSubmitting, setFieldError, resetForm }) => {
        // setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          console.log('form submitted values',values)
          setSubmitting(false);
          fetch('/api/template', {method:'POST', body:JSON.stringify(values)})
          .then( async (response)=>{
            message.success({
              content: 'Template saved',
              className: 'custom-class',
              style: {
                float: "right",
              },
            })
            const newValues = {
              style: "Linear",
              direction: 1,
              color1: randomColor(),
              color2: randomColor(),
              name: "",
              author: "",
              template: "",
              colorFormat: "HEX"
            }
            resetForm({
              values: newValues
            })
            setFormValues(newValues)
            const newTemplates = await fetch('/api/template')
            const data = await newTemplates.json()
            setTemplatesFull(data)
            const templatesArrayToShow = (data||[]).map((template)=>{
              return {
                optionLabel: template.name + " | " + template.author,
                optionValue: template.id
              }
            })
            setTemplatesToShow(templatesArrayToShow)
          });
        // }, 400);
      },
      formInputsRows: [
        {
          inputs: [
            {
              name: 'template',
              label: 'Template',
              type: 'select',
              showSearch: true,
              responsive: {
                xs: 24
              },
              options: templatesToShow,
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                const selectedTemplate = templatesFull.find(template=>template.id === value);
                if(selectedTemplate){
                  setFieldValue('name',selectedTemplate.name)
                  setFieldValue('author',selectedTemplate.author)
                  setFieldValue('style',selectedTemplate.attributes.style)
                  setFieldValue('direction',selectedTemplate.attributes.direction)
                  setFieldValue('color1',selectedTemplate.attributes.color1)
                  setFieldValue('color2',selectedTemplate.attributes.color2)
                  setFieldValue('colorFormat',selectedTemplate.attributes.colorFormat)
                  setFormValues({
                    style: selectedTemplate.attributes.style,
                    direction: selectedTemplate.attributes.direction,
                    color1: selectedTemplate.attributes.color1,
                    color2: selectedTemplate.attributes.color2,
                    name: selectedTemplate.name,
                    author: selectedTemplate.author,
                    colorFormat: selectedTemplate.attributes.colorFormat
                  })
                }
              }
            }
          ]
        },
        {
          inputs: [
            {
              name: "style",
              label: "Style",
              placeholder: "",
              type: "radio",
              optionType: "button",
              buttonStyle: "solid",
              className: "style-input-options",
              responsive: {
                xs: 24
              },
              options: [
                {
                  label: "Linear",
                  value: "Linear"
                },
                {
                  label: "Radial",
                  value: "Radial"
                }
              ],
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            },
            {
              name: "direction",
              label: "Direction",
              placeholder: "",
              type: "radio",
              optionType: "button",
              buttonStyle: "solid",
              className: "direction-input-options",
              responsive: {
                xs: 24
              },
              options: [
                {
                  label: <ArrowUpOutlined rotate={-45}/>,
                  value: 1
                },
                {
                  label: <ArrowUpOutlined />,
                  value: 2
                },
                {
                  label: <ArrowUpOutlined rotate={45}/>,
                  value: 3
                },
                {
                  label: <ArrowUpOutlined rotate={-90}/>,
                  value: 4
                },
                {
                  label: <AimOutlined />,
                  value: 5,
                  disabled: formValues.style === 'Linear'
                },
                {
                  label: <ArrowUpOutlined rotate={90}/>,
                  value: 6
                },
                {
                  label: <ArrowUpOutlined rotate={-135}/>,
                  value: 7
                },
                {
                  label: <ArrowUpOutlined rotate={180}/>,
                  value: 8
                },
                {
                  label: <ArrowUpOutlined rotate={135}/>,
                  value: 9
                }
              ],
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            },
            {
              isSeparator: true,
              separatorTitle: "Colors"
            },
            {
              name: "color1",
              label: "",
              placeholder: "",
              type: "color",
              responsive: {
                xs: 8
              },
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            },
            {
              name: "color2",
              label: "",
              placeholder: "",
              type: "color",
              responsive: {
                xs: 8
              },
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            },
            {
              name: "randomColor",
              text: "Random",
              placeholder: "",
              type: "btnAction",
              action: ( values, rows, setFieldValue, resetForm ) => {
                const col1 = randomColor()
                const col2 = randomColor()
                setFieldValue('color1',col1)
                setFieldValue('color2',col2)
                let resultValues = values;
                resultValues.color1 = col1;
                resultValues.color2 = col2;
                setFormValues(resultValues)
              },
              responsive: {
                xs: 8
              }
            },
            {
              name: "colorFormat",
              label: "Color Format",
              placeholder: "",
              type: "radio",
              optionType: "button",
              buttonStyle: "solid",
              className: "style-input-options",
              responsive: {
                xs: 24
              },
              options: [
                {
                  label: "HEX",
                  value: "HEX"
                },
                {
                  label: "RGBA",
                  value: "RGBA"
                }
              ],
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            }
          ]
        },
        {
          inputs: [
            {
              name: "name",
              label: "Template name",
              placeholder: "",
              type: "text",
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            },
            {
              name: "author",
              label: "Author",
              placeholder: "",
              type: "text",
              customOnChange: ( value, rows, setFieldValue, resetForm, values ) => {
                setFormValues(values)
              }
            },
          ]
        }
      ],
  }

  return (
    <Layout className="layout-container">
      <Sider theme={siderTheme} width={320}>
        <div className="content-sider">
          <Button className="sider-theme-btn" onClick={changeSiderTheme} size="small" shape="circle">
            {siderTheme === 'light'? <BulbOutlined />:  <CloudOutlined />}
          </Button>
          <h2 className="title">
            CSS Grandient Generator
          </h2>
          <FormGenerator {...CssGradientFormOptions}/>
        </div>
      </Sider>
      <Content className="content-container" style={{background: cssOutput(formValues)}}>
        <h2>
          background: {cssOutput(formValues)}
        </h2>
      </Content>
    </Layout>
  )
}