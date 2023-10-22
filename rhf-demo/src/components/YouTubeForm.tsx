
import { useForm,useFieldArray,FieldErrors} from 'react-hook-form'
import {DevTool} from '@hookform/devtools'
import { useEffect } from 'react';

let renderCount=0
type FormValues = {
  username:string;
  email:string;
  channel:string;
  social:{
      twitter:''
      facebook:''
  };
  phoneNumbers:string[];
  phNumbers:{
    number:string;
  }[];
  age:number;
  dob:Date
}

const YouTubeForm = () => {
  const form = useForm<FormValues>(
    {
      defaultValues:async()=>{
        const res=await fetch('https://jsonplaceholder.typicode.com/users/1');
        const data=await res.json()
        return{
          username:'Batman',
          email:data.email,
          channel:'',
          social:{
            twitter:'',
            facebook:''
          },
          phoneNumbers:['',''],
          phNumbers:[{number:''}],
          age:0,
          dob:new Date(),

        }

      },
      mode:'onTouched'
    }
  ); 
  const {register,control,handleSubmit,formState,watch,getValues,setValue,reset}=form; /*IMPORTANT*/
  const {errors,isDirty,isValid,isSubmitting,isSubmitted,isSubmitSuccessful}=formState
  console.log(isSubmitting,isSubmitted,isSubmitSuccessful)

  const {fields,append,remove}=useFieldArray({
    name:'phNumbers',
    control
  })
  const onSubmit=(data:FormValues)=>{
    console.log('form Submitted',data)
  }
  useEffect(()=>{
    if(isSubmitSuccessful){
      reset()
    }
  },[isSubmitSuccessful,reset])

  const handleGetValues=()=>{
    console.log('GetValues',getValues(['username','channel']))
  }
  const handleSetValues =()=>{
    setValue('username','Clark',{
      shouldDirty:true,
      shouldTouch:true,
      shouldValidate:true
    })
  }

  const onError=(errors:FieldErrors<FormValues>)=>{
    console.log('FormErrors',errors)
  }

  const watchUser=watch(['username','email']);
  renderCount++
  //const {name,ref,onChange,onBlur}=register('username')
  return (
    <div>
      <h1>Form Rerendered ({renderCount})</h1>
      <h2>{watchUser}</h2>
        <form onSubmit={handleSubmit(onSubmit,onError)} noValidate>
          <div className='form-control'>
          <div className='form-control'>

            <label htmlFor="username">Username</label>
            {/* <input type='text' id='username' name={name} ref={ref} onChange={onChange} onBlur={onBlur}/> */}
            <input type='text' id='username' {...register('username',{required:'Username is required'})}/>
            {/* <p className='error'>{errors?.username?.message}</p> */}
            </div>
            <label htmlFor="email">E-mail</label>
            <input type='email' id='email' {...register('email',{pattern:{
              value:/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
              message:'Invalid Email Format'
            },
            validate:(fieldValue)=>{
              return fieldValue !=='admin@example.com' ||
              'Enter a different email address'
            }
            })}/>
              <p className='error'>{errors?.email?.message}</p>
              <div className='form-control'>
            <label htmlFor="channel">Channel</label>
            <input type='text' id='channel' {...register('channel',{required:'Channel field is required'})}/>
            {/* <p className='error'>{errors?.channel?.message}</p> */}
            </div>
          <div className='form-control'>

            <label htmlFor="twitter">Twitter</label>
            <input type='text' id='twitter' {...register('social.twitter',{required:'Twitter Id field is required'})}/>
            <p className='error'>{errors?.social?.twitter?.message}</p>
            </div>

          <div className='form-control'>
            
            <label htmlFor="facebook">Facebook</label>
            <input type='text' id='facebook' {...register('social.facebook',{required:'Facebook Id field is required'})}/>
            <p className='error'>{errors?.social?.facebook?.message}</p>
            </div>

            <div className='form-control'>
            
            <label htmlFor="primary-phone">Primary phone number </label>
            <input type='text' id='primary-phone' {...register('phoneNumbers.0',{required:'Primary phone number field is required'})}/>
            <p className='error'>{errors?.phoneNumbers && errors.phoneNumbers[0]?.message}</p>
            </div>

            <div className='form-control'>
            
            <label htmlFor="secondary-phone">Secondary phone number </label>
            <input type='text' id='secondary-phone' {...register('phoneNumbers.1',{required:'Secondary phone number field is required'})}/>
            <p className='error'>{errors?.phoneNumbers && errors?.phoneNumbers[1]?.message}</p>
            </div>

            <div>
              <label htmlFor="">List of phone numbers</label>
              <div>
                {
                  fields.map((field,index)=>(
                    <div className="form-control" key={field.id}>
                      <input type='text' {...register(`phNumbers.${index}.number` as const)}/>
                      {
                        index > 0 && (
                          <button type='button' onClick={()=>remove(index)}>Remove</button>
                          )
                      }
                    </div>
                  ))}
                  <button type='button' onClick={()=>append({number:''})}>Add phone number</button>

              </div>
            </div>

            <div className='form-control'>
            <label htmlFor="age">Age</label>
            <input type='number' id='age' {...register('age',{valueAsNumber:true,required:'Age field is required'},)}/>
            <p className='error'>{errors?.age?.message}</p>
            </div>

            <div className='form-control'>
            <label htmlFor="dob">Date of Birth</label>
            <input type='date' id='dob' {...register('dob',{valueAsDate:true,required:'Date of Birth field is required'},)}/>
            <p className='error'>{errors?.dob?.message}</p>
            </div>


            <button disabled={!isDirty || !isValid}>Submit</button> 
            <button type='button' onClick={handleGetValues}>Get values </button>
            <button type='button' onClick={()=>reset()}>Reset </button>

            <button type='button' onClick={handleSetValues}>Set values </button>

            </div>
        </form>
        <DevTool control={control}/>
    </div>
  )
}

export default YouTubeForm