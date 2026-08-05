[1mdiff --git a/src/components/TaskCard.tsx b/src/components/TaskCard.tsx[m
[1mindex c911cd9..be87d45 100644[m
[1m--- a/src/components/TaskCard.tsx[m
[1m+++ b/src/components/TaskCard.tsx[m
[36m@@ -4,17 +4,102 @@[m [mimport { colors } from '../theme/colors';[m
 import { spacing, radius } from '../theme/spacing';[m
 import { typography } from '../theme/typography';[m
 import { moderateScale } from 'react-native-size-matters';[m
[32m+[m[32mimport StatusBadge from './StatusBadge';[m
[32m+[m[32mimport CircularTimer from './CircularTimer';[m
[32m+[m
 [m
 const chevronIcon = require('../assets/icons/chevron-right.png');[m
 [m
[31m-type TaskCardProps = {[m
[32m+[m[32m// Props for List View (existing)[m
[32m+[m[32mtype ListViewProps = {[m
   icon: ImageSourcePropType;[m
   title: string;[m
   timeRange: string;[m
   status: string;[m
 };[m
 [m
[31m-const TaskCard = ({ icon, title, timeRange, status }: TaskCardProps) => {[m
[32m+[m[32m// Props for Active Task View (new)[m
[32m+[m[32mtype ActiveTaskViewProps = {[m
[32m+[m[32m  variant: 'active';[m
[32m+[m[32m  status: string;[m
[32m+[m[32m  gpsStatus: string;[m
[32m+[m[32m  elapsedTime: string;[m
[32m+[m[32m  taskTitle: string;[m
[32m+[m[32m  trackingMessage: string;[m
[32m+[m[32m  progress?: number;[m
[32m+[m[32m  employeeName?: string;[m
[32m+[m[32m  designation?: string;[m
[32m+[m[32m  avatar?: any;[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32m// Combined Props[m
[32m+[m[32mtype TaskCardProps = ListViewProps | ActiveTaskViewProps;[m
[32m+[m
[32m+[m[32mconst TaskCard = (props: TaskCardProps) => {[m
[32m+[m[32m  // Check if it's the active variant[m
[32m+[m[32m  const isActiveVariant = 'variant' in props && props.variant === 'active';[m
[32m+[m
[32m+[m[32m  // Render Active Task Card (New Design)[m
[32m+[m[32m  if (isActiveVariant) {[m
[32m+[m[32m    const {[m
[32m+[m[32m      status,[m
[32m+[m[32m      gpsStatus,[m
[32m+[m[32m      elapsedTime,[m
[32m+[m[32m      taskTitle,[m
[32m+[m[32m      trackingMessage,[m
[32m+[m[32m      progress = 72,[m
[32m+[m[32m      employeeName,[m
[32m+[m[32m      designation,[m
[32m+[m[32m      avatar,[m
[32m+[m[32m    } = props as ActiveTaskViewProps;[m
[32m+[m
[32m+[m[32m    return ([m
[32m+[m[32m      <View style={styles.activeCard}>[m
[32m+[m[32m        {/* Header with employee info (optional) */}[m
[32m+[m[32m        {employeeName && ([m
[32m+[m[32m          <View style={styles.activeHeader}>[m
[32m+[m[32m            <View>[m
[32m+[m[32m              <Text style={styles.activeName}>{employeeName}</Text>[m
[32m+[m[32m              {designation && ([m
[32m+[m[32m                <Text style={styles.activeDesignation}>{designation}</Text>[m
[32m+[m[32m              )}[m
[32m+[m[32m            </View>[m
[32m+[m[32m            {avatar && ([m
[32m+[m[32m              <View style={styles.activeAvatar}>[m
[32m+[m[32m                {typeof avatar === 'string' ? ([m
[32m+[m[32m                  <Image source={{ uri: avatar }} style={styles.activeAvatarImage} />[m
[32m+[m[32m                ) : ([m
[32m+[m[32m                  <Image source={avatar} style={styles.activeAvatarImage} />[m
[32m+[m[32m                )}[m
[32m+[m[32m              </View>[m
[32m+[m[32m            )}[m
[32m+[m[32m          </View>[m
[32m+[m[32m        )}[m
[32m+[m
[32m+[m[32m        {/* Badges Row */}[m
[32m+[m[32m        <View style={styles.activeBadgesContainer}>[m
[32m+[m[32m          <StatusBadge label={status} type="active" />[m
[32m+[m[32m          <StatusBadge label={gpsStatus} type="gps" />[m
[32m+[m[32m        </View>[m
[32m+[m
[32m+[m[32m        {/* Circular Timer */}[m
[32m+[m[32m        <CircularTimer elapsedTime={elapsedTime} progress={progress} />[m
[32m+[m
[32m+[m[32m        {/* Task Details */}[m
[32m+[m[32m        <View style={styles.activeDetailsContainer}>[m
[32m+[m[32m          <Text style={styles.activeTaskTitle}>{taskTitle}</Text>[m
[32m+[m[32m          <View style={styles.activeTrackingContainer}>[m
[32m+[m[32m            <View style={styles.activeTrackingDot} />[m
[32m+[m[32m            <Text style={styles.activeTrackingMessage}>{trackingMessage}</Text>[m
[32m+[m[32m          </View>[m
[32m+[m[32m        </View>[m
[32m+[m[32m      </View>[m
[32m+[m[32m    );[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  // Render List View Task Card (Existing Design)[m
[32m+[m[32m  const { icon, title, timeRange, status } = props as ListViewProps;[m
[32m+[m[41m  [m
   return ([m
     <View style={styles.card}>[m
       <View style={styles.left}>[m
[36m@@ -37,6 +122,7 @@[m [mconst TaskCard = ({ icon, title, timeRange, status }: TaskCardProps) => {[m
 };[m
 [m
 const styles = StyleSheet.create({[m
[32m+[m[32m  // ========== EXISTING LIST VIEW STYLES ==========[m
   card: {[m
     flexDirection: 'row',[m
     alignItems: 'center',[m
[36m@@ -95,6 +181,84 @@[m [mconst styles = StyleSheet.create({[m
     height: moderateScale(16),[m
     opacity: 0.3,[m
   },[m
[32m+[m
[32m+[m[32m  // ========== NEW ACTIVE TASK VIEW STYLES ==========[m
[32m+[m[32m  activeCard: {[m
[32m+[m[32m    backgroundColor: '#FFFFFF',[m
[32m+[m[32m    borderRadius: 16,[m
[32m+[m[32m    padding: 24,[m
[32m+[m[32m    marginHorizontal: 20,[m
[32m+[m[32m    marginVertical: 12,[m
[32m+[m[32m    shadowColor: '#000',[m
[32m+[m[32m    shadowOffset: {[m
[32m+[m[32m      width: 0,[m
[32m+[m[32m      height: 2,[m
[32m+[m[32m    },[m
[32m+[m[32m    shadowOpacity: 0.08,[m
[32m+[m[32m    shadowRadius: 8,[m
[32m+[m[32m    elevation: 4,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeHeader: {[m
[32m+[m[32m    flexDirection: 'row',[m
[32m+[m[32m    justifyContent: 'space-between',[m
[32m+[m[32m    alignItems: 'center',[m
[32m+[m[32m    marginBottom: 16,[m
[32m+[m[32m    paddingBottom: 16,[m
[32m+[m[32m    borderBottomWidth: 1,[m
[32m+[m[32m    borderBottomColor: '#F0F0F0',[m
[32m+[m[32m  },[m
[32m+[m[32m  activeName: {[m
[32m+[m[32m    fontSize: 18,[m
[32m+[m[32m    fontWeight: 'bold',[m
[32m+[m[32m    color: '#333333',[m
[32m+[m[32m  },[m
[32m+[m[32m  activeDesignation: {[m
[32m+[m[32m    fontSize: 14,[m
[32m+[m[32m    color: '#999999',[m
[32m+[m[32m    marginTop: 2,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeAvatar: {[m
[32m+[m[32m    width: 44,[m
[32m+[m[32m    height: 44,[m
[32m+[m[32m    borderRadius: 22,[m
[32m+[m[32m    overflow: 'hidden',[m
[32m+[m[32m  },[m
[32m+[m[32m  activeAvatarImage: {[m
[32m+[m[32m    width: 44,[m
[32m+[m[32m    height: 44,[m
[32m+[m[32m    borderRadius: 22,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeBadgesContainer: {[m
[32m+[m[32m    flexDirection: 'row',[m
[32m+[m[32m    marginBottom: 8,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeDetailsContainer: {[m
[32m+[m[32m    marginTop: 12,[m
[32m+[m[32m    borderTopWidth: 1,[m
[32m+[m[32m    borderTopColor: '#F0F0F0',[m
[32m+[m[32m    paddingTop: 16,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeTaskTitle: {[m
[32m+[m[32m    fontSize: 16,[m
[32m+[m[32m    fontWeight: '600',[m
[32m+[m[32m    color: '#333333',[m
[32m+[m[32m    marginBottom: 8,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeTrackingContainer: {[m
[32m+[m[32m    flexDirection: 'row',[m
[32m+[m[32m    alignItems: 'center',[m
[32m+[m[32m  },[m
[32m+[m[32m  activeTrackingDot: {[m
[32m+[m[32m    width: 6,[m
[32m+[m[32m    height: 6,[m
[32m+[m[32m    borderRadius: 3,[m
[32m+[m[32m    backgroundColor: '#4CAF50',[m
[32m+[m[32m    marginRight: 8,[m
[32m+[m[32m  },[m
[32m+[m[32m  activeTrackingMessage: {[m
[32m+[m[32m    fontSize: 14,[m
[32m+[m[32m    color: '#666666',[m
[32m+[m[32m  },[m
 });[m
 [m
 export default TaskCard;[m
\ No newline at end of file[m
