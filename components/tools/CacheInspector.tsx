import { client } from '@/client/client'
import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { SearchHeader } from '../common/SearchInput'
import { Text } from '../common/Text'

export const CacheInspector =()=> { 
  const [filter, setFilter] = useState<string>('')
  
  const data = useMemo(() => {
    // @ts-expect-error
    const cacheData = client.cache.data.data as Record<string, any>
    return Object.entries(cacheData).filter(([key, value]) => {
      return key.includes(filter) || JSON.stringify(value).includes(filter)
    })
  // @ts-expect-error
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, client.cache?.data?.data])

  return (
    <FlatList
      data={data}
      ListHeaderComponent={
        <SearchHeader
          value={filter}
          placeholder="Page"
          onSearch={setFilter}
        />
      }
      keyExtractor={([key]) => key}
      renderItem={({ item }) => <CacheItem item={item} />}
    />
  )
}

const CacheItem = ({ item }: { item: [string, any] }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [key, value] = item
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => setCollapsed(!collapsed)}>
      <Text>{key}</Text>
      {!collapsed ? (
        <Text style={{ marginTop: 5 }}>
          {JSON.stringify(value, null, 2)}
        </Text>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})