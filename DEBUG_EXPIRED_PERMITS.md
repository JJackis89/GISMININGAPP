# 🔍 EXPIRED PERMITS DISCREPANCY ANALYSIS

## Issue Identified
- **Notification Service**: Shows 2 expired permits
- **Stats Card**: Shows 3 expired permits

## Root Cause Analysis

### 1. **Different Calculation Logic**

**Notification Service** (`src/services/notificationService.ts` line 38):
```typescript
// Only creates notifications for expired permits
if (concession.status === 'Expired' || (expiryDate < today && concession.status === 'Active')) {
  newNotifications.push({...}) // Creates notification
}
```

**Stats Calculation** (`src/services/arcgisService.ts` line 445):
```typescript
// Counts all expired permits for stats
const expiredConcessions = concessions.filter(c => {
  const expiryDate = new Date(c.permitExpiryDate)
  if (isNaN(expiryDate.getTime()) || c.permitExpiryDate === 'Not Specified') {
    return c.status === 'Expired'  // ← DIFFERENCE HERE
  }
  return c.status === 'Expired' || (expiryDate < today && c.status === 'Active')
}).length
```

### 2. **The Key Difference**

**Problem**: The stats calculation includes permits with:
- `status === 'Expired'` AND invalid/missing expiry dates
- But the notification service **skips** these entirely

**Notification Service Logic**:
```typescript
// Skip if expiry date is invalid
if (isNaN(expiryDate.getTime()) || concession.permitExpiryDate === 'Not Specified') {
  return  // ← SKIPS these records completely
}
```

**Stats Calculation Logic**:
```typescript
// Still counts invalid dates if status is 'Expired'
if (isNaN(expiryDate.getTime()) || concession.permitExpiryDate === 'Not Specified') {
  return c.status === 'Expired'  // ← COUNTS these as expired
}
```

## Solution Required

The notification service should **match** the stats calculation logic to show consistent counts.

### Fix Option 1: Update Notification Service
Make notification service count the same way as stats:

```typescript
// Before the date validation, check for status-based expired permits
if (concession.status === 'Expired') {
  // Always create notification for permits marked as expired
  newNotifications.push({...})
  return // Skip further processing for this record
}

// Then continue with date-based logic for active permits
if (isNaN(expiryDate.getTime()) || concession.permitExpiryDate === 'Not Specified') {
  return // Skip date-based checks if no valid date
}
```

### Fix Option 2: Update Stats Calculation  
Make stats calculation match notification logic (not recommended as it would hide expired permits without dates).

## Recommendation
**Use Fix Option 1** - Update the notification service to include permits that are marked as 'Expired' regardless of date validity, ensuring the notification count matches the stats card count.

This will show:
- ✅ Notification: 3 expired permits  
- ✅ Stats Card: 3 expired permits  
- ✅ Consistent user experience
