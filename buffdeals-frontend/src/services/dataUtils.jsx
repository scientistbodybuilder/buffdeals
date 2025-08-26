import supabase from '../supabaseClient';

export const loadRecent = async () => {
    try {
        const date = new Date().toISOString().split('T')[0]
        const { data } = await supabase.from("scraped_data").select("name,href,brand,trunc_name,sizes").gt('date_scraped', `${date}T00:00:00Z`).limit(50)
        if (data) {
            console.log('Recent data loaded successfully:', data)
            return data
        }

    } catch (err) {
        console.log('Error loading recent data:', err)
    }
}

export const searchProducts = async () => {
    try {

    } catch (err) {
        console.log('Error searching products:', err)
    }
}

export const updateSearches = async () => {
        const { data, error } = await supabase.from("users")
        .select("recent_searches")
        .eq('email', email)
        if (error) {

        } else {
            console.log('search history', data[0]['recent_searches'])
            let new_list
            if (data[0]['recent_searches'] && data[0]['recent_searches'].length > 2) {
                console.log('Existing search history of over 2 searches')
                data[0]['recent_searches'].push(searchKey)
                new_list = data[0]['recent_searches'].slice(1) 
            } else if (data[0]['recent_searches']) {
                console.log('Existing search history of under 3 searches')
                data[0]['recent_searches'].push(searchKey)
                new_list = data[0]['recent_searches']
            } else {
                console.log('No search history')
                new_list = [searchKey]
            }

            console.log(`search list: ${new_list}`)
            const { error } = await supabase.from("users")
            .update({recent_searches: new_list})
            .eq("email", email)
            if (error) {
                console.error('Error updating search history', error)
            } else {
                console.log('Search history updated')
                //update it on the ui
                setSearchHistory(new_list)
            }
        }
    }

    const strToNum = (text) => {
        const num = parseFloat(text.replace(/[^\d,.]/g, '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
    }

    export const SearchDB = async (search_term, settings) => {
        // setLoading(true)
        // setSearched(true)
        try {
            console.log(`searching:`, search_term)
            // const searchTerms = searchKey.toLowerCase().split(" ")

            // const { data, error } = await supabase.rpc('filter_by_price_range', { min_price: settings.min_price, max_price: settings.max_price, search_key: search_term.toLowerCase().trim() })
            const searchPattern = `%${search_term.trim().split(" ").join("%")}%`;
            const { data, error } = await supabase.from("scraped_data").select("name,href,brand,trunc_name,sizes")
            .or(`name.ilike.${searchPattern}, brand.ilike.${searchPattern}`)

            if (error){
                console.error('Error in searching db', error)
                return null
            } else if (data) {
                console.log('Db query successful, data:', data)
                const filtered_data = data.filter((item) => {
                    return item.sizes.some((size) => {
                        const priceInRange = strToNum(size.price) >= settings.min_price && strToNum(size.price) <= settings.max_price;
                        const veganMatch = !settings.vegan_only || size.vegan === true;
                        
                        return priceInRange && veganMatch;
                    });
                });
                return filtered_data;
                
                
            } else {
                console.log('Db query successful, but no data')
                return null
            }
            // setLoading(false)
        } catch (e) {
            console.error('Error', e)
            return null
            // setLoading(false)
        }    
    }