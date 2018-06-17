<template>
  <v-app id="app">
  	<v-toolbar dark fixed app>
    	<v-toolbar-side-icon 
    	  @click.native.stop="sideNav = !sideNav" 
    	  ></v-toolbar-side-icon>
    	<v-toolbar-title>
    	<router-link to="/" tag="span" style="cursor: pointer">Poker</router-link>
    	</v-toolbar-title>
    	<v-spacer></v-spacer>
    </v-toolbar>
  <v-navigation-drawer temporary dark v-model="sideNav" clipped fixed app>
  	  <v-list>
  	  	<v-list-tile 
  	  	v-for="item in menuItems" 
  	  	:key="item.title" 
  	  	router
  	  	:to="item.link"
  	  	>
  	  	  <v-list-tile-action>
  	  	    <v-icon>{{ item.icon }}</v-icon>
  	  	  </v-list-tile-action>
  	  	  <v-list-tile-content>
  	  	    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
  	  	  </v-list-tile-content>
  	  	</v-list-tile>
  	  </v-list>
  	</v-navigation-drawer>	
    
    <main>
    	<v-content>
    <router-view>
    </router-view>  
    </v-content>      		
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
    	sideNav: false,
    	menuItems: [
    		{ icon: 'home', title: 'Home', link: '/'},
    		{ icon: 'credit_card', title: 'Calculate', link: '/calculate'},
    		{ icon: 'android', title: 'Android', link: '/android'},
    		{ icon: 'calendar_today', title: 'Calendar', link: '/calendar'},
    		{ icon: 'notification_important', title: 'Alert', link: '/alert'},
    		{ icon: 'file_copy', title: 'Files', link: '/files'}
    	]    	
    }
  },
  name: 'App'
}
</script>
