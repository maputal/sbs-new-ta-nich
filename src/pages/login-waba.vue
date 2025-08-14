<script setup>
// import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import WAOnBoarding from '@images/indosat/WAOnboarding.png';
import depLogoGrey from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png';
//services masih belum dipake 
import { useGlobalStore } from '@/store/useGlobalStore';

const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const form = ref({ email: '' })
const isTermsandConditions = ref(false)

const nextTermsandConditions = () => {
  if(isTermsandConditions.value == false ){
    isTermsandConditions.value = true
  } else {
    isTermsandConditions.value = false
    isTermsandConditionsAgreed.value = false
  }
}

const isTermsandConditionsAgreed = ref(false)
const validateTermsandConditionsAgreement = [v => !!v || '' ]

const isCreateWABAACC = ref(false)
const createWABAACC = () => {
  isConfirmDialogVisible.value = true
}

const createWABAACCRequirements = [
  'Create new or select existing Facebook and WhatsApp Business accounts',
  'Provide a display name and description for your WhatsApp business profile.',
  'Connect and verify your phone number to use for the WhatsApp API access.',
]
const WABAACCTermsConditions = [
  {judul:'WhatsApp Commerce Policy - ', path:'https://www.whatsapp.com/legal/commerce-policy/'},
  {judul:'WhatsApp Business Policy - ', path:'https://www.whatsapp.com/legal/business-policy/'},
  {judul:'WhatsApp Business Platform Policy Enforcement - ', path:'https://developers.facebook.com/docs/whatsapp/overview/policy-enforcement'},
  {judul:'WhatsApp Business Terms of Service - ', path:'https://www.whatsapp.com/legal/business-terms-20230427'},
]

const isLoginWabaSuccess = ref(false)

const WABAData = {
  accessToken: null,
  phoneID: null ,
  wabaID: null,
  currentStep: null,
}

const toDashboard = () => {
  router.replace(route.query.redirect ? String(route.query.redirect) : '/dashboard')
}

const toLogin = () => {
  router.replace('/logout')
}

// const testlaunchWhatsAppSignup = () => {
//   // dialog.value = true

//   let pload = {}
//   window.moffas.do_request(
//     'startEmbedded',
//     pload,
//     onLoadStartEmbedded,
//     onDataError,
//   )

  
// }

// const testVerifEmbed = () => {
//   let pload = {
//     waba_id:'110809131741407',
//     phone_id:'111524281668956' 
//   }
//   window.moffas.do_request(
//     'verifEmbedded',
//     pload,
//     onLoadVerifEmbedded,
//     onDataError,
//   )
// }

// const testCancelEmbed = () => {
//   let pload = {
//     current_step:'BUSINESS_ACCOUNT_SELECTION',
//   }
//   window.moffas.do_request(
//     'cancelEmbedded',
//     pload,
//     onLoadCancelEmbedded,
//     onDataError,
//   )
// }

// Facebook Login with JavaScript SDK
const launchWhatsAppSignup = () => {
  console.log('launchWhatsAppSignup')
  let pload = {}
  window.moffas.do_request(
    'startEmbedded',
    pload,
    onLoadStartEmbedded,
    onDataError,
  )
  // Conversion tracking code
  window.fbq && fbq('trackCustom', 'WhatsAppOnboardingStart', {appId: '580449523645721', feature: 'whatsapp_embedded_signup'});
  
  
  // Launch Facebook login
  FB.login(function (response) {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      WABAData.accessToken = accessToken
      console.log(accessToken)
      //Use this token to call the debug_token API and get the shared WABA's ID
      // belum di gunakan
      // allInOneServices.apiAuthenticate(accessToken);
    } else {
      console.log('User cancelled login or did not fully authorize.');
      return;
    }
  }, {
    scope: 'business_management,whatsapp_business_management,whatsapp_business_messaging',
    return_scopes: true,
    extras: {
      feature: 'whatsapp_embedded_signup',
      "version": 2,
      //  Receive Session Logging Info
      "sessionInfoVersion": 2,
      setup: {
        // Prefilled data can go here
      }
    }
  });
}

const LazyConfirmDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/confirm.vue'))
const isConfirmDialogVisible = ref(false)
const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref()

const dialog = ref(false)

const onLoadVerifEmbedded = (data) => {
  console.log('masuk onLoadVerifEmbedded')
  console.log(JSON.parse(data))
  dialog.value = false
  isLoginWabaSuccess.value = true
}

const onLoadCancelEmbedded = (data) => {
  console.log('masuk onLoadCancelEmbedded')
  console.log(JSON.parse(data))

  dialog.value = false
}

const onLoadStartEmbedded = (data) => {
  console.log('masuk onLoadStartEmbedded')
  console.log(JSON.parse(data))

  dialog.value = true
}

const onDataError = (e) => {
  console.log(e)
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const warningBlockedDialog = (data) => {
  isCreateWABAACC.value = true
}

const sessionInfoListener = (event) => {
  

  if (event.origin !== "https://www.facebook.com") return;
  try {
    const data = JSON.parse(event.data);
    console.log("fb event=")
    console.log(data.event)
    console.log("fb data=")
    console.log(data.data)

    if (data.type === 'WA_EMBEDDED_SIGNUP') {
      console.log("disini WA_EMBEDDED_SIGNUP=")

      if (data.event === 'FINISH') {
        const {phone_number_id, waba_id} = data.data;
        // console.log('sucessfully login')
        WABAData.phoneID = phone_number_id
        WABAData.wabaID = waba_id
        let pload = {
          waba_id:waba_id,
          phone_id:phone_number_id 
        }
        window.moffas.do_request(
          'verifEmbedded',
          pload,
          onLoadVerifEmbedded,
          onDataError,
        )
        // isLoginWabaSuccess.value = true
      } else if (data.event === 'CANCEL') {
        const{current_step} = data.data;
        WABAData.currentStep = current_step

        console.log("disini cancel woy=")
        console.log(data.data.current_step)

        let pload = {
          current_step:current_step,
        }
        window.moffas.do_request(
          'cancelEmbedded',
          pload,
          onLoadCancelEmbedded,
          onDataError,
        )
      }
    }
  } catch {
    // Don’t parse info that’s not a JSON
    console.log('Non JSON Response', event.data);
  }
};
window.addEventListener('message', sessionInfoListener);

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup
  if(isEmbeddedSignup){
    toDashboard()
  }
})
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <LazyConfirmDialogs
      v-model:isDialogVisible="isConfirmDialogVisible"
      @clicked="warningBlockedDialog"
    >
    </LazyConfirmDialogs>
    <VCard
      class="auth-card pa-4 pt-7"
      width="584"
      v-if="isLoginWabaSuccess"
    >
      <VCardItem class="justify-center mb-8">
        <div class="d-flex">
          <VImg
            :width="160"
            :src="depLogoGrey"
          />
        </div>
      </VCardItem>

      <VCardText class="d-flex justify-center pt-2">
        <p class="black-text text-center mb-12">
          Thankyou, for your cooperation
          <br>
          Now, your account has been activated 
        </p>
      </VCardText>
      
      <VCardText class="d-flex justify-center mb-8">
        <VBtn
          type="submit"
          class="d-flex align-center font-weight-bold justify-center"
          @click="toLogin"
        >
          ok
        </VBtn>
      </VCardText>
    </VCard>
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="584"
      v-if="!isTermsandConditions && !isCreateWABAACC && !isLoginWabaSuccess"
    >
      <VCardItem class="justify-center">
        <div class="d-flex">
          <VImg
            :width="150"
            :src="depLogoGrey"
          />
        </div>
        <!-- <VCardTitle class="font-weight-medium text-2xl text-uppercase">
          {{ themeConfig.app.title }}
        </VCardTitle> -->
      </VCardItem>

      <VCardText class="d-flex justify-center pt-2">
        <p class="font-weight-bold text-center text-h6 mb-1">
          Create your WhatsApp Business Account
        </p>
      </VCardText>
      
      <VCardText class="mb-3">
        <p class="text-center black-text">
          To complete your registration, please click “Next” button 
          and follow the prompts to create your WhatsApp Business account
        </p>
      </VCardText>
      <VCardText class="d-flex justify-center">
        <div class="pr-5">
          <VBtn
            type="submit"
            variant="outlined"
            class="d-flex align-center font-weight-bold justify-center"
            @click="toLogin"
          >
            Logout
          </VBtn>
        </div>
        <VBtn
          type="submit"
          class="d-flex align-center font-weight-bold justify-center"
          @click="nextTermsandConditions"
        >
          Next
        </VBtn>
      </VCardText>
    </VCard>
    <VCard
      class="overflow-auto auth-card pa-4 pt-7"
      max-width="584"
      v-if="!!isTermsandConditions && !isCreateWABAACC && !isLoginWabaSuccess"
    >
      <VCardText class="d-flex justify-center pt-2">
        <p class="font-weight-bold text-h6 mb-1">
          Terms & Conditions
        </p>
      </VCardText>
      
      <VCardText class="mb-10 overflow-auto vcardtext--terms">
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          You are agree with the price selected by yourself in the Registration Form at https://dep.ioh.id/#/register and
          willing to pay for Setup Fee and Usage Fee (Pay per Usages) generated by you and your system through IOH WhatsApp
          Business Platform.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          Price exclude PPN 11%.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          Service & Price are exclude WhatsApp Phone Number.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          Pricing model, terms & condition may be change anytime subject to policy, term, and changes applied by Meta.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          Price only valid for indonesia number (+62) only. Another price may apply if chat happen from/to other's countrys
          phone number. Customer agree to pay another extra charge if chat traffic happen from other country outside indonesia.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          You must maintain a WhatsApp Business profile with accurate and up-to-date customer support contact information and one
          or more of the following: email address, website address, and/or telephone number.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          In order to initiate WhatsApp message to a person, you must first receive their opt-in permission. 
          The opt-in must clearly state that the person is agreeing to receive messages from you over WhatsApp and 
          include your business' name.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          You must respect all requests (either on or off WhatsApp) by a person to block, discontinue, or otherwise opt out
          of communications from you via WhatsApp, including removing that person from your contacts list.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          To help ensure high quality conversations between businesses and customers, we enforce on businesses that 
          repeatedly violate high-risk policies. Business Accounts will first get a warning detailing the policy 
          they violated. If they continue to violate the policy, businesses may see messaging restrictions that 
          gradually increase in duration and severity. 
          See WhatsApp Business Platform Policy Enforcement for detail - https://developers.facebook.com/docs/whatsapp/overview/policy-enforcement/.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          You are solely responsible for your transactions and providing any sales terms, privacy terms, or other terms applicable 
          to your interactions with users.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          IOH is not responsible for determining, collecting, withholding, reporting, and remitting all applicable taxes,
          duties, fees, and additional charges for sales relating to your transactions.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          Offers to sell and sales of illegal and certain other products or services are prohibited as stated in WhatsApp
          Commerce Policy.
        </p>
        <p class="black-text">
          <VIcon
            size="7"
            icon="mdi-square"
            class="me-2"
          />
          Client understand & agree with all the term & conditions required by Meta, as stated below
        </p>
        <ul class="d-flex flex-column black-text gap-y-3 mb-1 pa-2">
          <li
            v-for="item in WABAACCTermsConditions"
            :key="item"
            class="d-flex"
          >
            <div>
              <VIcon
                size="7"
                icon="mdi-circle"
                class="me-3"
              />
            </div>
            <span class="mb-2">{{ item.judul }} <a target="_blank" rel="noopener noreferrer" :href="item.path">{{ item.path }}</a></span>
          </li>
        </ul>
        <VCheckbox
          v-model="isTermsandConditionsAgreed"
          :rules="validateTermsandConditionsAgreement"
          label="I agree with the Terms and Conditions"
          class="d-flex flex-wrap align-center black-text"
        />
      </VCardText>
      <VCardText class="d-flex justify-center">
        <VBtn
          variant="tonal"
          color="error"
          class="me-16"
          @click="nextTermsandConditions"
        >
          Decline
        </VBtn>
        <VBtn
          variant="elevated"
          :disabled="!isTermsandConditionsAgreed"
          @click="createWABAACC"
        >
          Accept
        </VBtn>
      </VCardText>
    </VCard>
    <VCard
      class="overflow-auto auth-card pa-4 pt-7"
      max-width="1200"
      v-if="isCreateWABAACC&&!isLoginWabaSuccess"
    >
      <VRow>
        <!-- 👉 First Name -->
        <VCol
          md="6"
          cols="12"
        >
          <VCardItem class="justify-center">
            <div class="d-flex">
              <VImg
                :width="260"
                :src="WAOnBoarding"
              />
            </div>
          </VCardItem>
        </VCol>
        <VCol
          md="6"
          cols="12"
        >
          <VCardText>
            <p class="font-weight-bold black-text text-body-1 mb-2">
              Connect your Facebook Business Account
            </p>
            <p class="font-weight-normal black-text mb-4">
              To continue, you will need to access your company’s Facebook business
              account. By clicking the ‘Continue with Facebook’ button below you can:
            </p>
            <ul class="d-flex flex-column black-text gap-y-3 mb-1 pa-2">
              <li
                v-for="item in createWABAACCRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="mdi-circle"
                    class="me-3"
                  />
                </div>
                <span class="mb-2">{{ item }}</span>
              </li>
            </ul>
            <div class="d-flex justify-center mb-3">
              <v-alert
                max-width="480"
                type="warning"
                text="Do not use a number that’s already connected to a whatsapp account, you won’t be able to complete 
                the process"
                style="color: black !important;"
              ></v-alert>
            </div>
          </VCardText>
          <VBtn
            variant="tonal"
            class="waba-btn mb-5"
            width="100%"
            @click="launchWhatsAppSignup"
          >
            Continue with Facebook
          </VBtn>
        </VCol>

        <!-- <v-fade-transition hide-on-leave>
          <v-card
            v-if="dialog"
            append-icon="$close"
            class="mx-auto"
            elevation="16"
            max-width="500"
            title="To Verif Embed"
          >
            <template v-slot:append>
              <v-btn 
                icon="$close" 
                variant="text" 
                @click="
                  testCancelEmbed()
                ">
              </v-btn>
            </template>

            <v-divider></v-divider>

            <div class="py-12 text-center">
              <v-icon
                class="mb-6"
                color="success"
                icon="mdi-check-circle-outline"
                size="128"
              ></v-icon>

              <div class="text-h4 font-weight-bold">This account want To Verif Embed</div>
            </div>

            <v-divider></v-divider>

            <div class="pa-4 text-end">
              <v-btn
                class="text-none"
                color="medium-emphasis"
                min-width="92"
                rounded
                variant="outlined"
                @click="testVerifEmbed()"
              >
                Verif
              </v-btn>
            </div>
          </v-card>
        </v-fade-transition> -->
      </VRow>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.waba-btn {
  background: #1877f2;
  color: #ffff !important;
  font-size: 1rem;
  text-transform: inherit !important;

  --v-btn-height: 42px;
}
</style>

<route lang="yaml">
meta:
  requiresAuth: true
  layout: blank
</route>
