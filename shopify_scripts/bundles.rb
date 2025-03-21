# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# For validation purposes, bundles must be defined within
# the BUNDLES global at the top of this script. The format
# is as follows:
#
# PARENT_PRODUCT_ID => {
#   price: INT (in dollars)
#   max_items: INT (max number of items within the bundle)
#   items: ARRAY (of possible bundle item product IDs)
# }
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

BUNDLES = {}

class Bundles
  def initialize()
    @bundle_message = 'Bundle'
  end

  def run(cart, locale)
    # Sort bundles into hash
    sorted_bundles = Hash.new
    bundle_items = cart.line_items.select{ |item| item.properties['_bundleProductsId'] }
    bundle_items.each do |item|
      unless sorted_bundles[item.properties['_bundleProductsId']]
        sorted_bundles[item.properties['_bundleProductsId']] = Array.new
      end
      sorted_bundles[item.properties['_bundleProductsId']].push item
    end

    sorted_bundles.each do |key, bundle|
      # Get bundle ID and data
      bundle_id = bundle[0].properties["_bundleId"].to_i
      bundle_data = BUNDLES[bundle_id]

      # Validate size of bundle
      return if bundle.size > bundle_data[:max_items]

      # Validate bundle items
      found_invalid_item = bundle.any? do |item|
        !bundle_data[:items].find { |i| i == item.variant.product.id }
      end
      return if found_invalid_item

      # Set initial bundle price
      bundle_price = Money.new(cents: bundle_data[:price] * 100)
      bundle_remaining_application = bundle_price.cents
      line_value = bundle.map(&:line_price).reduce(Money.new(cents: 0), :+)

      # Set bundle item prices
      bundle.each_with_index do |item, index|
        proportional_price = (item.line_price.cents / line_value.cents * bundle_price.cents).round
        bundle_remaining_application = bundle_remaining_application - proportional_price
        # Ensure last item is adjusted due to rounding
        if bundle_remaining_application != 0 and index == bundle.size - 1
          proportional_price += bundle_remaining_application
        end
        item.change_line_price(Money.new(cents: proportional_price * item.quantity), { message: @bundle_message })
      end
    end
  end
end

CAMPAIGNS = [
  Bundles.new(),
]

CAMPAIGNS.each do |campaign|
  campaign.run(Input.cart, Input.locale)
end

Output.cart = Input.cart