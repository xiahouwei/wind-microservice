<template>
	<div class="login-form">
		<div class="login-form__title">
			<w-icon type="app-logo" width="40px" height="40px"></w-icon>
			<h2 class="login-form__title-text">{{$t('lang.login.appTitle')}}</h2>
		</div>
		<div class="login-form__block fx-shadow-block">
			<el-form ref="ruleForm" :model="ruleForm" :rules="rules">
				<el-tabs v-model="loginType" :stretch="true">
					<el-tab-pane :label="$t('lang.login.userLoginLabel')" name="username">
						<el-form-item prop="username" class="form-item-user">
							<w-input
								v-model="ruleForm.username"
								:placeholder="$t('lang.login.username')"
								size="medium"
								@keypress.enter.native="onCellInputEnter(arguments, 'loginPassword')"
							>
								<i slot="prefix" class="el-icon-user input-icon"></i>
							</w-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane :label="$t('lang.login.phoneLoginLabel')" name="phone">
						<el-form-item prop="phone" class="form-item-user">
							<w-input
								v-model="ruleForm.phone"
								:placeholder="$t('lang.login.phonenumber')"
								size="medium"
								@keypress.enter.native="onCellInputEnter(arguments, 'loginPassword')"
							>
								<i slot="prefix" class="el-icon-mobile-phone input-icon"></i>
							</w-input>
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
				<el-form-item prop="password" class="form-item-password">
					<w-input
						ref="loginPassword"
						v-model="ruleForm.password"
						:placeholder="$t('lang.login.password')"
						size="medium"
						show-password
						@keypress.enter.native="onCellInputEnter(arguments, 'VerifyCode')"
					>
						<i slot="prefix" class="el-icon-lock input-icon"></i>
					</w-input>
				</el-form-item>
				<fx-details-form-row>
					<el-form-item slot="left" prop="verifyCode">
						<w-input
							ref="VerifyCode"
							v-model="ruleForm.verifyCode"
							:placeholder="$t('lang.login.verifyCode')"
							size="medium"
							@keypress.enter.native="onCellInputEnter(arguments, 'submit')"
						>
							<i slot="prefix" class="el-icon-mobile-phone input-icon"></i>
						</w-input>
					</el-form-item>
					<el-form-item slot="right" prop="name">
						<el-tooltip effect="dark" :content="$t('lang.login.clickRefresh')" placement="right-start">
							<img :src="authCodeImgUrl" class="auth-code-img fx-cursor" @click="onimageClick">
						</el-tooltip>
					</el-form-item>
				</fx-details-form-row>
			</el-form>
			<div class="login-form__block-link">
				<w-link>{{$t('lang.login.forgetPassword')}}</w-link>
			</div>
			<el-button type="primary" size="medium" :loading="logining" class="login-confirm" @click="onLoginClick('ruleForm')">{{$t('lang.login.login')}}</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LoginForm',
	props: {
		logining: Boolean
	},
	data () {
		const validateHandler = (rule, value, callback) => {
			if (!value) {
				callback(new Error(rule.message))
			} else {
				callback()
			}
		}
		return {
			ruleForm: {
				username: '',
				phone: '',
				password: '',
				verifyCode: ''
			},
			rules: {
				username: [{
					message: this.$t('lang.login.rulesMessageUsername'),
					validator: this.validateUserName,
					trigger: 'change'
				}],
				phone: [{
					message: this.$t('lang.login.rulesMessagePhone'),
					validator: this.validateUserPhone,
					trigger: 'change'
				}],
				password: [{
					message: this.$t('lang.login.rulesMessagePassword'),
					validator: validateHandler,
					trigger: 'change'
				}],
				verifyCode: [{
					message: this.$t('lang.login.rulesMessageVerifyCode'),
					validator: validateHandler,
					trigger: 'change'
				}]
			},
			timestamp: new Date().getTime(),
			loginType: 'username',
			verifyUuid: this.$fxUtils.createUUID()
		}
	},
	computed: {
		authCodeImgUrl () {
			return `/auth/v1/${this.verifyUuid}/getVerifyCode?timestamp=${this.timestamp}`
		}
	},
	methods: {
		onLoginClick (ruleForm) {
			this.$refs[ruleForm].validate().then(() => {
				this.$emit('on-login', {
					...this.ruleForm,
					loginType: this.loginType,
					uuid: this.verifyUuid,
					host: this.getHostId()
				})
			})
		},
		onCellInputEnter (arg, prop) {
			if (prop === 'submit') {
				this.onLoginClick('ruleForm')
			} else {
				this.$refs[prop].focus()
			}
		},
		onimageClick () {
			this.timestamp = new Date().getTime()
			this.verifyUuid = this.$fxUtils.createUUID()
		},
		validateUserName (rule, value, callback) {
			if (!value && this.loginType === 'username') {
				callback(new Error(rule.message))
			} else {
				callback()
			}
		},
		validateUserPhone (rule, value, callback) {
			if (!value && this.loginType === 'phone') {
				callback(new Error(rule.message))
			} else {
				callback()
			}
		},
		getHostId () {
			if (this.$route.query.hostId) {
				return this.$route.query.hostId
			}
			return this.$fxRouter.getLastDomain()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.login-form {
	display: flex;
	flex-direction: column;
	width: 425px
	height: 520px
	&__title {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 80px
		&-text {
			font-size: 20px
			font-weight: 900
			margin-left:20px
		}
	}
	&__block {
		flex:1
		display:flex
		flex-direction: column;
		padding: 40px 40px
		&-link {
			height:30px
			font-size: 14px
			color: $fxDefaultColor
			margin-bottom:30px
			display:flex
			flex-direction: row
			justify-content: flex-end
		}
		.form-item-user, .form-item-password {
			padding-bottom: 20px
		}
		.auth-code-img {
			height: 36px
			width: 170px
		}
		.login-confirm {
			margin-top: 20px
		}
		.input-icon {
			position: relative;
			top: 2px;
		}
	}
}
</style>


